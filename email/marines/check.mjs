import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url)) + "/";
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const html = fs.readFileSync(DIR + "index.html", "utf8");
const txt  = fs.readFileSync(DIR + "plain-text.txt", "utf8");
const LP = "us8kmm-n0.myshopify.com";
const UTM = { utm_source:"mailchimp", utm_medium:"email", utm_campaign:"bogo_sept2026", utm_content:"marine" };

let fail = 0, warn = 0;
const ok  = m => console.log("  \x1b[32mOK\x1b[0m   " + m);
const bad = m => { fail++; console.log("  \x1b[31mFALHA\x1b[0m " + m); };
const wrn = m => { warn++; console.log("  \x1b[33mAVISO\x1b[0m " + m); };

function checkUrl(u, where) {
  let p; try { p = new URL(u); } catch { bad(`${where}: URL invalida -> ${u}`); return; }
  if (p.hostname !== LP) { bad(`${where}: host ${p.hostname} != ${LP}`); return; }
  for (const [k, v] of Object.entries(UTM)) {
    const got = p.searchParams.get(k);
    if (got !== v) { bad(`${where}: ${k}="${got}" (esperado "${v}")`); return; }
  }
  return true;
}

const b = await chromium.launch({ executablePath: CHROME, args:["--no-sandbox"] });
const pg = await b.newPage();
await pg.setContent(html);

console.log("\n1) LINKS NO DOM");
const anchors = await pg.$$eval("a[href]", as => as.map(a => ({ href: a.getAttribute("href"), text: (a.innerText||"").trim().slice(0,42) })));
let lpCount = 0;
for (const a of anchors) {
  const h = a.href;
  if (h.startsWith("*|")) { ok(`merge tag ${h}`); continue; }
  if (h.startsWith("mailto:") || h.startsWith("tel:")) { ok(`${h}`); continue; }
  if (checkUrl(h, `link "${a.text||"(imagem)"}"`)) lpCount++;
}
console.log(`  -> ${anchors.length} links no DOM, ${lpCount} para a LP com UTM completo`);

console.log("\n2) LINKS DENTRO DOS COMENTARIOS CONDICIONAIS OUTLOOK (VML)");
const vml = [...html.matchAll(/<v:roundrect[^>]*href="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, "&"));
if (!vml.length) bad("nenhum botao VML encontrado");
vml.forEach((u, i) => { if (checkUrl(u, `VML #${i+1}`)) ok(`VML #${i+1} com UTM completo`); });

console.log("\n3) SHOPIFY INTERNO (nenhum link sem UTM)");
const shopUrls = [...(html + "\n" + txt).matchAll(/https?:\/\/[^\s"'<>]*myshopify\.com[^\s"'<>]*/gi)]
  .map(m => m[0].replace(/&amp;/g, "&"));
const semUtm = shopUrls.filter(u => {
  try { const p = new URL(u); return Object.entries(UTM).some(([k, v]) => p.searchParams.get(k) !== v); }
  catch { return true; }
});
if (!shopUrls.length) ok("nenhuma URL myshopify.com no material");
else if (semUtm.length) bad(`${semUtm.length} link(s) myshopify.com sem UTM completo: ${semUtm[0]}`);
else ok(`${shopUrls.length} URLs myshopify.com, todas com os 4 UTMs`);

console.log("\n4) DESCADASTRO");
html.includes("*|UNSUB|*") ? ok("*|UNSUB|* presente no HTML") : bad("*|UNSUB|* ausente no HTML");
txt.includes("*|UNSUB|*")  ? ok("*|UNSUB|* presente no texto") : bad("*|UNSUB|* ausente no texto");
const unsubAnchor = anchors.find(a => a.href === "*|UNSUB|*");
unsubAnchor ? ok(`ancora de descadastro: "${unsubAnchor.text}"`) : bad("descadastro nao e um <a> clicavel");

console.log("\n5) ENDERECO FISICO (CAN-SPAM)");
const ADDR = "2005 SW 20th St, Ste 105, Fort Lauderdale, FL 33315";
const bodyText = await pg.evaluate(() => document.body.innerText);
bodyText.includes(ADDR) ? ok("endereco YachtPro no rodape do HTML") : bad("endereco ausente no HTML");
txt.includes(ADDR) ? ok("endereco YachtPro no texto puro") : bad("endereco ausente no texto");
if (/Waycross|Coconut Creek/i.test(html)) bad("endereco da Malbor presente na peca YachtPro");
else ok("sem endereco da Malbor (peca correta)");

console.log("\n6) ASSUNTO / PREHEADER");
const title = await pg.title();
title === "Buy 1, Get 1: 3.78L gallons built for salt water" ? ok(`title = "${title}"`) : bad(`title = "${title}"`);
const PRE = "Two weeks only. Discount applies automatically at checkout.";
html.includes(PRE) ? ok("preheader presente e oculto") : bad("preheader ausente");

console.log("\n7) IMAGENS");
const imgs = await pg.$$eval("img", is => is.map(i => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt"), w: i.getAttribute("width") })));
const noAlt = imgs.filter(i => i.alt === null);
noAlt.length ? bad(`${noAlt.length} imagem(ns) sem atributo alt`) : ok(`${imgs.length} imagens, todas com alt (${imgs.filter(i=>i.alt==="").length} decorativas)`);
const noW = imgs.filter(i => !i.w);
noW.length ? wrn(`${noW.length} imagem(ns) sem width explicito`) : ok("todas com width explicito");
const files = fs.readdirSync(DIR + "assets");
const refd = [...new Set(imgs.map(i => i.src.split("/").pop()))];
const orfas = refd.filter(f => !files.includes(f));
orfas.length ? bad(`referenciadas mas ausentes em assets/: ${orfas.join(", ")}`) : ok(`${refd.length} arquivos referenciados, todos presentes em assets/`);
const naoUsadas = files.filter(f => !refd.includes(f));
naoUsadas.length ? wrn(`em assets/ mas nao usadas: ${naoUsadas.join(", ")}`) : ok("nenhum asset orfao");

console.log("\n8) TEXTO PURO");
const txtUrls = [...txt.matchAll(/https?:\/\/\S+/g)].map(m => m[0]);
txtUrls.forEach((u, i) => checkUrl(u, `texto puro #${i+1}`));
txtUrls.length >= 2 ? ok(`${txtUrls.length} URLs no texto puro, todas com UTM`) : bad("poucas URLs no texto puro");

console.log("\n9) JANELA DA CAMPANHA");
const WINDOW = { badge: /Valid September 16[^0-9]{1,8}30, 2026/, until: /through September 30 or until stock runs out\./ };
WINDOW.badge.test(bodyText) ? ok("HTML: \"Valid September 16-30, 2026\"") : bad("HTML: data do badge incorreta");
WINDOW.until.test(bodyText) ? ok("HTML: \"through September 30\"") : bad("HTML: data de encerramento incorreta");
WINDOW.badge.test(txt) ? ok("texto puro: \"Valid September 16-30, 2026\"") : bad("texto puro: data do badge incorreta");
WINDOW.until.test(txt) ? ok("texto puro: \"through September 30\"") : bad("texto puro: data de encerramento incorreta");
const STALE = /September 29|September 15|15\s*[-\u2013]\s*29/;
(STALE.test(bodyText) || STALE.test(txt)) ? bad("data antiga (15-29 / September 29) ainda presente") : ok("nenhuma data antiga remanescente");

console.log("\n10) PLACEHOLDER DE ASSETS");
const ph = (html.match(/ASSET-BASE-REPLACE-ME/g) || []).length;
ph ? wrn(`${ph} ocorrencias de ASSET-BASE-REPLACE-ME (trocar pela URL do Mailchimp antes de enviar)`) : ok("sem placeholders");

await b.close();
console.log("\n" + "=".repeat(60));
console.log(fail ? `\x1b[31m${fail} FALHA(S)\x1b[0m, ${warn} aviso(s)` : `\x1b[32mTODAS AS VERIFICACOES PASSARAM\x1b[0m (${warn} aviso(s) esperado(s))`);
process.exit(fail ? 1 : 0);
