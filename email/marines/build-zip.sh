#!/usr/bin/env bash
# Gera o pacote para o "Import zip" do Mailchimp (Code your own > Import zip).
# Estrutura: index.html na raiz + images/ com os assets, referenciados por
# caminho relativo. O Mailchimp hospeda as imagens e reescreve os src na
# importacao, entao nao e preciso subir nada no Content Studio nem trocar
# o placeholder ASSET-BASE-REPLACE-ME manualmente.
set -euo pipefail
cd "$(dirname "$0")"
OUT="bogo-marines-mailchimp.zip"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/images"
cp assets/* "$TMP/images/"
sed 's#https://ASSET-BASE-REPLACE-ME/#images/#g' index.html > "$TMP/index.html"

# trava de seguranca: nenhum placeholder pode sobreviver
if grep -q "ASSET-BASE-REPLACE-ME" "$TMP/index.html"; then
  echo "ERRO: placeholder ainda presente" >&2; exit 1
fi
# trava: todo src relativo precisa existir no pacote
miss=0
while read -r f; do
  [ -f "$TMP/$f" ] || { echo "ERRO: referenciado mas ausente: $f" >&2; miss=1; }
done < <(grep -o 'src="images/[^"]*"' "$TMP/index.html" | sed 's/src="//;s/"$//' | sort -u)
[ "$miss" -eq 0 ] || exit 1

rm -f "$OUT"
(cd "$TMP" && zip -q -r - index.html images) > "$OUT"
echo "gerado: $OUT"
unzip -l "$OUT" | tail -3
