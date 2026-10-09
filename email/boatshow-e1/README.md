# E1 — Boat Show out/2026 (ML-18, conta Yacht Pro)

Disparo previsto: **qui 15/10, 9:00 (horário da Flórida)**, audience Jobber.
Agendamento em qua 14/10. Nada foi criado no Mailchimp.

| Arquivo | O que é |
|---|---|
| `index.html` | HTML de e-mail, 600px, tabelas + CSS inline |
| `plain-text.txt` | Versão texto puro |
| `assets/` | 8 imagens (4 fotos de produto finais) |
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

## PONTO DE TROCA — hero, arte final do Borges (seg 12/10)

As **fotos de produto são finais**: são as da loja, aplicadas em 09/10.
Só o hero segue placeholder, hoje reusando o do BOGO. Está marcado no HTML
com o comentário `TROCAR:`.

| Arquivo em `assets/` | Situação | Exibição | Exportar em |
|---|---|---|---|
| `hero-showseason.jpg` | **pendente** | 600 × 270 | 1200 × 540 |
| `product-deep-cleaning-apc.jpg` | final | 256 × 260 | 512 × 520 |
| `product-max-pro-shampoo.jpg` | final | 256 × 260 | 512 × 520 |
| `product-nano-polymer-marine.jpg` | final | 256 × 260 | 512 × 520 |
| `product-hydro-coat.jpg` | final | 256 × 260 | 512 × 520 |

As fotos entram por `contain` sobre `#f4f4f2`, o mesmo cinza da célula do
card, então a garrafa aparece inteira sem corte e sem emenda no fundo.

Duas observações sobre o material recebido:

- **Só vieram os galões**, não as embalagens pequenas. O frame do card
  mostra o galão; o brinde é comunicado na linha de texto
  (`3.78L — $39 · free 473ml`). Se quiser o pequeno também na imagem,
  precisa das 4 fotos das embalagens de 473ml/946ml.
- **Hydro Coat veio em 450×600**, contra 1500×2000 das outras três. Ainda
  cobre o 2× da exibição, mas é a única sem folga. Se houver original
  maior, vale trocar.

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
