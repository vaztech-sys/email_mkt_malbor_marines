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
https://us8kmm-n0.myshopify.com/?utm_source=mailchimp&utm_medium=email&utm_campaign=bogo_sept2026&utm_content=marine
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
que nenhum link myshopify.com fique sem UTM, `*|UNSUB|*` como âncora clicável, endereço
físico CAN-SPAM da YachtPro, título e preheader, `alt` e `width` em todas
as imagens, assets referenciados vs. presentes, e as URLs do texto puro.

## Decisões e limitações

- **Endereço do rodapé** está fixo no HTML
  (`2005 SW 20th St, Ste 105, Fort Lauderdale, FL 33315`) em vez de
  `*|LIST:ADDRESS|*`, para garantir o endereço da YachtPro mesmo que a
  configuração da audience esteja diferente.
- **Destino é o domínio interno da Shopify** (`us8kmm-n0.myshopify.com`),
  alterado a pedido em 15/09/2026; antes era `bogo.malborcoatings.com`.
  Atenção: a Shopify normalmente 301-redireciona o domínio `.myshopify.com`
  para o domínio primário da loja, então o clique pode acabar em
  `bogo.malborcoatings.com` de qualquer forma. Não foi possível confirmar
  daqui — o proxy do ambiente bloqueia os dois hosts com 403. Os UTMs
  sobrevivem ao redirect. Reverter é um `sed` de um host só, nos três
  arquivos.
- **Largura 800px**, como no design original. É mais largo que os 600px
  convencionais; abaixo de 640px o layout empilha em coluna única.
- **Imagens de produto** têm origem em 248x331px, exibidas a 225x238 —
  só 1,1x, então ficam levemente suaves em tela retina. Precisaria de
  arte em resolução maior para melhorar.
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
