# E2 — Boat Show out/2026 (ML-18, conta Yacht Pro)

Disparo previsto: **qui 29/10, 9:00 (horário da Flórida)**, audience Jobber.
Agendamento em qua 14/10. Nada foi criado no Mailchimp.

Peça curta de lembrete, na semana do show. Mesma base técnica do E1:
600px, tabelas + CSS inline, botão com fallback VML.

| Arquivo | O que é |
|---|---|
| `index.html` | HTML de e-mail, 600px |
| `plain-text.txt` | Versão texto puro |
| `assets/` | 3 imagens (logo YachtPro, hero, logo Malbor) |
| `check.mjs` | Verificador da campanha |
| `build-zip.sh` | Gera `boatshow-e2-yachtpro.zip` |

## Configuração da campanha

| Campo | Valor |
|---|---|
| Subject | `Boat show week — the free size ends Sunday` |
| Preheader | `Free small size with every 3.78L gallon, through November 1.` |
| From name | `Yacht Pro USA` |
| From e-mail | `contact@yachtprousa.com` |
| Audience | Jobber |

Destino de todos os links:

```
https://bogo.malborcoatings.com/?utm_source=mailchimp&utm_medium=email&utm_campaign=boatshow_oct2026&utm_content=marine
```

## Assets — todos finais

`assets/hero-showseason.jpg` é a foto do veleiro envernizado na doca,
aplicada em 09/10, a mesma do E1. Exibe a 600 × 270, exportada em
1200 × 540. Nenhum ponto de troca pendente.

## Verificação e publicação

```bash
npm install playwright-core   # uma vez
node check.mjs
./build-zip.sh
```

Suba o zip em **Code your own > Import zip**. Não marque o CSS Inliner e
não cole o snippet de unsubscribe — o `*|UNSUB|*` já está no rodapé.
