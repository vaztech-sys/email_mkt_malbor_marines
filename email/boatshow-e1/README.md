# E1 — Boat Show out/2026 (ML-18, conta Yacht Pro)

Disparo previsto: **qui 15/10, 9:00 (horário da Flórida)**, audience Jobber.
Agendamento em qua 14/10. Nada foi criado no Mailchimp.

| Arquivo | O que é |
|---|---|
| `index.html` | HTML de e-mail, 600px, tabelas + CSS inline |
| `plain-text.txt` | Versão texto puro |
| `assets/` | 8 imagens |
| `check.mjs` | Verificador da campanha |
| `build-zip.sh` | Gera `boatshow-e1-yachtpro.zip` para o Import zip |

## Configuração da campanha

| Campo | Valor |
|---|---|
| Subject | `What we use to get boats show-ready (and a free size with every gallon)` |
| Preheader | `Free 473ml with each 3.78L gallon, through November 1.` |
| From name | `Yacht Pro USA` |
| From e-mail | `contact@yachtprousa.com` |
| Audience | Jobber |

Destino de todos os links:

```
https://bogo.malborcoatings.com/?utm_source=mailchimp&utm_medium=email&utm_campaign=boatshow_oct2026&utm_content=marine
```

## PONTOS DE TROCA — arte final do Borges, seg 12/10

As imagens de produto e o hero são **placeholders**. Os de produto trazem
"ARTE PENDENTE · BORGES 12/10" impresso, para não passarem por arte final.
No HTML cada ponto está marcado com o comentário `TROCAR:`.

| Arquivo em `assets/` | O que entra | Dimensão de exibição |
|---|---|---|
| `hero-showseason.jpg` | hero de temporada (hoje reusa o do BOGO) | 600 × 270 |
| `product-deep-cleaning-apc.png` | galão 3.78L + 473ml | 256 × 200 |
| `product-max-pro-shampoo.png` | galão 3.78L + 946ml | 256 × 200 |
| `product-nano-polymer-marine.png` | galão 3.78L + 473ml | 256 × 200 |
| `product-hydro-coat.png` | galão 3.78L + 473ml | 256 × 200 |

Exporte em **2× da exibição** (hero 1200×540, produtos 512×400), mantenha o
nome do arquivo e rode `node check.mjs` depois. Não foi possível puxar as
fotos da loja: `cdn.shopify.com` está bloqueado pela política de egresso
deste ambiente (403 no CONNECT).

## Verificação

```bash
npm install playwright-core   # uma vez
node check.mjs
```

Além do que o verificador do BOGO já cobria, este confere:
`utm_campaign=boatshow_oct2026`, janela 15/10–01/11, e os termos proibidos
do ML-18: `permanent`, `booth`, `visit us`, `delivery`, `September`,
`Buy 1`, `alternative to ceramic coating`.

## Publicação

`./build-zip.sh` e suba o zip em **Code your own > Import zip**. Não marque
o CSS Inliner, não cole o snippet de unsubscribe, e confira depois de
importar que os `src` viraram URLs do Mailchimp e que os blocos
`<!--[if mso]>` sobreviveram.

## Decisões registradas

- **Grade de produtos 2×2**, não 4 em linha. A 600px, quatro colunas dariam
  ~124px por card, estreito demais para as bullets. Em 2×2 cada card tem
  256px.
- **Headline em caixa alta**, como no texto aprovado. Se preferir caixa de
  sentença, é uma linha.
- Copy aguardando aprovação do Fernando (qui 8/10); bullets de Hydro Coat e
  Nano Polymer são as conservadoras da loja, a trocar pelo ML-7.
