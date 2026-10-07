import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ===== configuracao da peca =====
const CFG = {
  titulo: "What we use to get boats show-ready (and a free size with every gallon)",
  preheader: "Free 473ml with each 3.78L gallon, through November 1.",
  datasObrigatorias: ["October 15", "November 1"],
  minLinksLP: 8,
};
// ================================

const DIR = path.dirname(fileURLToPath(import.meta.url)) + "/";
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const html = fs.readFileSync(DIR + "index.html", "utf8");
const txt  = fs.readFileSync(DIR + "plain-text.txt", "utf8");

const LP = "bogo.malborcoatings.com";
const UTM = { utm_source:"mailchimp", utm_medium:"email", utm_campaign:"boatshow_oct2026", utm_content:"marine" };
const ENDERECO = "2005 SW 20th St, Ste 105, Fort Lauderdale, FL 33315";
// ML-18: sem FLIBS, sem claim de durabilidade, sem campanha anterior
const PROIBIDOS = ["permanent","booth","visit us","delivery","September","Buy 1","alternative to ceramic coating"];
const DATAS_ANTIGAS = /September|bogo_sept2026|October 1[^5]|November [2-9]/;

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
let lp = 0;
for (const a of anchors) {
  const h = a.href;
  if (h.startsWith("*|")) { ok(`merge tag ${h}`); continue; }
  if (h.startsWith("mailto:") || h.startsWith("tel:")) { ok(h); continue; }
  if (checkUrl(h, `link "${a.text||"(imagem)"}"`)) lp++;
}
lp >= CFG.minLinksLP ? ok(`${lp} links para a LP com UTM completo (minimo ${CFG.minLinksLP})`)
                     : bad(`so ${lp} links para a LP (esperado ao menos ${CFG.minLinksLP})`);

console.log("\n2) LINKS NO VML DO OUTLOOK");
const vml = [...html.matchAll(/<v:roundrect[^>]*href="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, "&"));
if (!vml.length) bad("nenhum botao VML encontrado");
vml.forEach((u, i) => { if (checkUrl(u, `VML #${i+1}`)) ok(`VML #${i+1} com UTM completo`); });

console.log("\n3) SHOPIFY INTERNO");
if (/myshopify\.com/i.test(html) || /myshopify\.com/i.test(txt)) bad("referencia a myshopify.com encontrada");
else ok("nenhuma referencia a myshopify.com");

console.log("\n4) DESCADASTRO");
html.includes("*|UNSUB|*") ? ok("*|UNSUB|* presente no HTML") : bad("*|UNSUB|* ausente no HTML");
txt.includes("*|UNSUB|*")  ? ok("*|UNSUB|* presente no texto") : bad("*|UNSUB|* ausente no texto");
anchors.find(a => a.href === "*|UNSUB|*") ? ok("descadastro e ancora clicavel") : bad("descadastro nao e um <a>");

console.log("\n5) ENDERECO FISICO (CAN-SPAM)");
const bodyText = await pg.evaluate(() => document.body.innerText);
bodyText.includes(ENDERECO) ? ok("endereco YachtPro no rodape") : bad("endereco ausente no HTML");
txt.includes(ENDERECO) ? ok("endereco YachtPro no texto puro") : bad("endereco ausente no texto");
if (/Waycross|Coconut Creek/i.test(html)) bad("endereco da Malbor numa peca YachtPro");
else ok("sem endereco da Malbor");

console.log("\n6) ASSUNTO / PREHEADER");
const title = await pg.title();
title === CFG.titulo ? ok(`title correto`) : bad(`title = "${title}"`);
html.includes(CFG.preheader) ? ok("preheader presente e oculto") : bad("preheader ausente ou divergente");

console.log("\n7) IMAGENS");
const imgs = await pg.$$eval("img", is => is.map(i => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt"), w: i.getAttribute("width") })));
imgs.filter(i => i.alt === null).length ? bad("imagem sem atributo alt") : ok(`${imgs.length} imagens, todas com alt`);
imgs.filter(i => !i.w).length ? bad("imagem sem width explicito") : ok("todas com width explicito");
const files = fs.readdirSync(DIR + "assets");
const refd = [...new Set(imgs.map(i => i.src.split("/").pop()))];
const faltando = refd.filter(f => !files.includes(f));
faltando.length ? bad(`referenciadas mas ausentes em assets/: ${faltando.join(", ")}`) : ok(`${refd.length} arquivos referenciados, todos presentes`);
const sobrando = files.filter(f => !refd.includes(f));
sobrando.length ? wrn(`em assets/ mas nao usadas: ${sobrando.join(", ")}`) : ok("nenhum asset orfao");

console.log("\n8) JANELA DA CAMPANHA (15/10 - 01/11)");
for (const d of CFG.datasObrigatorias) {
  bodyText.includes(d) ? ok(`HTML contem "${d}"`) : bad(`HTML nao contem "${d}"`);
  txt.includes(d) ? ok(`texto puro contem "${d}"`) : bad(`texto puro nao contem "${d}"`);
}
(DATAS_ANTIGAS.test(bodyText) || DATAS_ANTIGAS.test(txt))
  ? bad("data ou campanha antiga remanescente (September / bogo_sept2026)")
  : ok("nenhuma data ou campanha antiga remanescente");

console.log("\n9) TERMOS PROIBIDOS (ML-18)");
let achou = 0;
for (const t of PROIBIDOS) {
  const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const noHtml = re.test(bodyText), noTxt = re.test(txt);
  if (noHtml || noTxt) { achou++; bad(`termo proibido "${t}" encontrado${noHtml?" no HTML":""}${noTxt?" no texto":""}`); }
}
achou || ok(`nenhum dos ${PROIBIDOS.length} termos proibidos: ${PROIBIDOS.join(", ")}`);

console.log("\n10) TEXTO PURO");
const txtUrls = [...txt.matchAll(/https?:\/\/\S+/g)].map(m => m[0]);
txtUrls.forEach((u, i) => checkUrl(u, `texto puro #${i+1}`));
txtUrls.length ? ok(`${txtUrls.length} URLs no texto puro, todas com UTM`) : bad("nenhuma URL no texto puro");

console.log("\n11) PLACEHOLDERS");
const ph = (html.match(/ASSET-BASE-REPLACE-ME/g) || []).length;
ph ? wrn(`${ph} ocorrencias de ASSET-BASE-REPLACE-ME (o Import zip resolve)`) : ok("sem placeholder de assets");
const troca = (html.match(/TROCAR:/g) || []).length;
troca ? wrn(`${troca} pontos marcados "TROCAR:" (arte final do Borges, 12/10)`) : ok("sem pontos de troca pendentes");

await b.close();
console.log("\n" + "=".repeat(60));
console.log(fail ? `\x1b[31m${fail} FALHA(S)\x1b[0m, ${warn} aviso(s)` : `\x1b[32mTODAS AS VERIFICACOES PASSARAM\x1b[0m (${warn} aviso(s))`);
process.exit(fail ? 1 : 0);
