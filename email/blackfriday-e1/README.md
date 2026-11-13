# E1 — Black Friday nov/2026 (ML-41, conta Yacht Pro)

Disparo previsto: **sex 27/11, 9:00 (horário da Flórida)**, audience Jobber.
**Nada foi criado nem agendado no Mailchimp.**

HTML e texto vêm de `vaztech-sys/marketing-malbor`, branch
`claude/black-friday-2026`, pasta `black-friday/emails/e1-yachtpro/`, sem
nenhuma alteração de texto. O que mudou aqui: as imagens provisórias deram
lugar às artes finais do Figma, e a pasta ganhou `check.mjs` e
`build-zip.sh` no padrão deste repositório.

| Arquivo | O que é |
|---|---|
| `index.html` | HTML de e-mail, 600px, tabelas + CSS inline, tema escuro |
| `plain-text.txt` | Versão texto puro |
| `assets/` | 5 imagens |
| `check.mjs` | Verificador da campanha |
| `build-zip.sh` | Gera `blackfriday-e1-yachtpro.zip` para o Import zip |

## Configuração da campanha

| Campo | Valor |
|---|---|
| Subject | `Black Friday: keep your coating working (and a free SiO2 Top Sealant)` |
| Preheader | `25% off Malbor's Professional Line, 35% when you buy 5. Nov 27–30.` |
| From name | `Yacht Pro USA` |
| From e-mail | `contact@yachtprousa.com` |
| Audience | Jobber |

Destino de todos os links:

```
https://bogo.malborcoatings.com/?utm_source=mailchimp&utm_medium=email&utm_campaign=blackfriday_nov2026&utm_content=bf-marine
```

## Imagens

Exportadas do Figma em **13/11**, arquivo **`[MALBOR] Email_mkt`**
(`w963vkkHw77eIJtVseKOIH`), página BLACK FRIDAY, seção
"E-mails Black Friday — imagens (exportar)":

| Arquivo | Frame | Nó | Exibição | Exportado |
|---|---|---|---|---|
| `email-gift.jpg` | `email-gift` | `163:234` | 600 × 372 | 1200 × 745 |
| `email-boat.jpg` | `email-boat` | `163:165` | 600 × 361 | 1200 × 723 |

JPG a 1200 de largura, o 2× exato da exibição, recomprimidas com mozjpeg
q82: de 1002 KB para 129 KB somadas, sem perda visível.

A mesma seção existe no arquivo `[MALBOR] Redes Sociais`
(`fA11AO9QHYm3F5uQNvRTCz`). Comparei as duas versões pixel a pixel: a
diferença média é de 0,04/255, ou seja, só ruído de recompressão — a arte é
a mesma. Ficou a do `Email_mkt`.

## Verificação

```bash
npm install playwright-core   # uma vez
node check.mjs
```

Confere host e os 4 UTMs de cada link (inclusive os do VML, que ficam em
comentário condicional e não aparecem no DOM), ausência de `myshopify.com`,
`*|UNSUB|*` como âncora clicável, endereço CAN-SPAM da Yacht Pro, título e
preheader, `alt` e `width` nas imagens, a janela 27–30/11, a menção às duas
retiradas locais, e os 16 termos proibidos do ML-41: `permanent`,
`lifetime`, `months`, `years`, `delivery`, `free shipping`, alegação
ambiental, comparação com ceramic coating, `for your car`, `for your boat`,
`with your order`, entre outros.

## Publicação

`./build-zip.sh` e suba o zip em **Code your own > Import zip**. Não marque
o CSS Inliner, não cole o snippet de unsubscribe, e confira depois de
importar que os `src` viraram URLs do Mailchimp e que os blocos
`<!--[if mso]>` sobreviveram.

## Pendência conhecida

A arte `email-gift` começa com a frase **cortada** "with every Professional
Line bottle." — o frame do Figma corta a linha de cima ("FREE SiO2 Top
Sealant"), e sobra uma oração sem sujeito no topo da imagem. Duas saídas:
ajustar o `y` do frame no Figma e reexportar, ou aparar a faixa superior
da imagem aqui. Não mexi na arte do designer.
