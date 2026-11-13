# E3 — Black Friday nov/2026 (ML-41, conta Yacht Pro)

Disparo previsto: **seg 30/11, 9:00 (horário da Flórida)**, audience Jobber.
**Nada foi criado nem agendado no Mailchimp.**

Peça curta de último dia. HTML e texto vêm de `vaztech-sys/marketing-malbor`,
branch `claude/black-friday-2026`, pasta `black-friday/emails/e3-yachtpro/`,
sem nenhuma alteração de texto.

| Arquivo | O que é |
|---|---|
| `index.html` | HTML de e-mail, 600px, tema escuro |
| `plain-text.txt` | Versão texto puro |
| `assets/` | 3 imagens |
| `check.mjs` | Verificador da campanha |
| `build-zip.sh` | Gera `blackfriday-e3-yachtpro.zip` |

## Configuração da campanha

| Campo | Valor |
|---|---|
| Subject | `Last day: 25% off the Professional Line + free SiO2` |
| Preheader | `Ends tonight. Local pickup in Pompano Beach or Safe Harbor.` |
| From name | `Yacht Pro USA` |
| From e-mail | `contact@yachtprousa.com` |
| Audience | Jobber |

Destino de todos os links:

```
https://bogo.malborcoatings.com/?utm_source=mailchimp&utm_medium=email&utm_campaign=blackfriday_nov2026&utm_content=bf-marine
```

## Imagens

`email-gift.jpg` é o frame `email-gift` (nó `163:234`) do Figma
`[MALBOR] Email_mkt` (`w963vkkHw77eIJtVseKOIH`), exportado em JPG 1200 de
largura — o 2× exato da exibição de 600 × 372 — e recomprimido com mozjpeg
q82 (468 KB → 54 KB). É o mesmo arquivo usado no E1.

## Verificação e publicação

```bash
npm install playwright-core   # uma vez
node check.mjs
./build-zip.sh
```

Suba o zip em **Code your own > Import zip**. Não marque o CSS Inliner e não
cole o snippet de unsubscribe — o `*|UNSUB|*` já está no rodapé.

## Pendência conhecida

A arte `email-gift` começa com a frase **cortada** "with every Professional
Line bottle.", porque o frame do Figma corta a linha de cima. Mesma
pendência do E1; o arquivo é compartilhado, então a correção vale para os
dois.
