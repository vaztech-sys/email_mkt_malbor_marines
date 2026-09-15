# E-mail náutico — Campanha BOGO (conta YachtPro)

HTML de e-mail pronto para colar no Mailchimp, convertido de
`src/components/EmailPage.tsx` (export do Figma Make, React + Tailwind).

| Arquivo | O que é |
|---|---|
| `index.html` | HTML de e-mail — tabelas, CSS inline, responsivo |
| `plain-text.txt` | Versão texto puro |
| `assets/` | 10 imagens otimizadas (267 KB no total) |
| `check.mjs` | Verificador automático (links/UTM, descadastro, endereço, alt) |

## Configuração da campanha no Mailchimp

| Campo | Valor |
|---|---|
| Subject | `Buy 1, Get 1: 3.78L gallons built for salt water` |
| Preheader | `Two weeks only. Discount applies automatically at checkout.` |
| From name | `Yacht Pro USA` |
| From e-mail | **a definir** — usar um domínio autenticado da YachtPro |
| Audience | YachtPro (~230 contatos) |

O preheader também está embutido no HTML como bloco oculto, para clientes
que ignoram o campo do Mailchimp.

## Como publicar

1. **Suba `assets/`** em Content Studio do Mailchimp. Anote a URL base
   gerada (algo como `https://mcusercontent.com/<id>/images/`).
2. **Troque o placeholder** no `index.html` — são 14 ocorrências:

   ```
   https://ASSET-BASE-REPLACE-ME/   ->   <sua URL base>/
   ```

3. **Crie a campanha** como *Code your own → Paste in code* e cole o
   `index.html`. Salve como rascunho — **não agende, não envie**.
4. **Cole o texto puro** na aba *Plain-Text Email* (o Mailchimp gera uma
   versão automática pior; substitua pela de `plain-text.txt`).
5. Rode um **Inbox Preview** antes de liberar.

## Links

Todos os destinos apontam para a landing page com o UTM completo:

```
https://bogo.malborcoatings.com/?utm_source=mailchimp&utm_medium=email&utm_campaign=bogo_sept2026&utm_content=marine
```

São 13 links no DOM (2 botões CTA, hero, imagem do intro, 3 imagens de
produto, 3 títulos de produto, logo Malbor, logo do header, badge BOGO)
mais 2 dentro dos comentários condicionais VML do Outlook. O
`utm_content=marine` é o único separador de público nesta campanha —
não há cupom.

## Verificação

```bash
npm install playwright-core   # uma vez
node check.mjs                # CHROME_PATH=<binario> se o Chromium estiver noutro caminho
```

Cobre: host e os 4 UTMs de cada link (inclusive os do Outlook/VML),
ausência de `myshopify.com`, `*|UNSUB|*` como âncora clicável, endereço
físico CAN-SPAM da YachtPro, título e preheader, `alt` e `width` em todas
as imagens, assets referenciados vs. presentes, e as URLs do texto puro.

## Decisões e limitações

- **Endereço do rodapé** está fixo no HTML
  (`2005 SW 20th St, Ste 105, Fort Lauderdale, FL 33315`) em vez de
  `*|LIST:ADDRESS|*`, para garantir o endereço da YachtPro mesmo que a
  configuração da audience esteja diferente.
- **Largura 600px**, o padrão de e-mail. A geometria foi reescalada em
  0,75 a partir dos 800px do design original (paddings, colunas, imagens,
  botões), mas a tipografia **não** acompanhou linearmente: corpo de texto
  tem piso de 14px, texto auxiliar de 12px e os botões mantêm 48px de
  altura de toque. As bullets de produto subiram de 11px para 12px.
  Abaixo de 600px o layout empilha em coluna única.
- **Imagens de produto** têm origem em 248x331px e são exibidas a
  168x178, o que dá 1,5x — aceitável em retina. Os demais assets são
  exportados em 2x exato da dimensão de exibição.
- **Coluna das bullets do card** tem 142px no desktop, o que deixa as
  linhas curtas e com bastante quebra. É consequência do texto longo em
  grade de 3 colunas a 600px, não do layout. Se incomodar, as saídas são
  encurtar as bullets ou passar a grade para 2 colunas.
- **Cantos arredondados** usam `border-radius`; o Outlook desktop ignora
  e mostra cantos retos. Degradação aceitável.
- **Fontes** (Montserrat, Poppins, Work Sans) vêm por `@import` do Google
  Fonts, que só funciona em Apple Mail/iOS. Os demais clientes caem para
  Helvetica/Arial, já declarado em cada `font-family`.
- Os logos YachtPro e Malbor eram SVG inline (sem suporte em e-mail) e
  foram rasterizados em PNG a 2x a partir do DOM renderizado.

## Regenerar o preview local

```bash
sed 's#https://ASSET-BASE-REPLACE-ME/#assets/#g' index.html > _preview.html
```
