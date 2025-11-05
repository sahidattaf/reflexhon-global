#!/bin/bash
echo "🪶 Reflexhon Global 2027 — Setup Branding & GitHub Pages"
echo "-------------------------------------------------------"

# 1️⃣ Verify /public folder
mkdir -p public
echo "✅ Folder /public verifiká."

# 2️⃣ Copy core branding assets
if [ ! -f public/reflexhon_banner.png ]; then
  echo "⚠️ Missing banner (reflexhon_banner.png). Please add it manually."
fi
if [ ! -f public/reflexhon_favicon.png ]; then
  echo "⚠️ Missing favicon (reflexhon_favicon.png). Please add it manually."
fi
if [ ! -f public/reflexhon_logo_dark.svg ]; then
  echo "⚠️ Missing dark logo (reflexhon_logo_dark.svg)."
fi
if [ ! -f public/reflexhon_logo_light.svg ]; then
  echo "⚠️ Missing light logo (reflexhon_logo_light.svg)."
fi

# 3️⃣ Add banner to README if not present
if ! grep -q "reflexhon_banner.png" README.md; then
  echo "🖼️ Adding banner to README..."
  echo '<p align="center"><img src="./public/reflexhon_banner.png" width="640" alt="Reflexhon Global Banner"></p>' | cat - README.md > temp && mv temp README.md
fi

# 4️⃣ Embed favicon inside deck HTML
if grep -q "<head>" reflexhon_deck.html; then
  sed -i '/<head>/a <link rel="icon" type="image/png" href="./public/reflexhon_favicon.png" />' reflexhon_deck.html
  echo "🌐 Favicon embed add inside reflexhon_deck.html"
fi

# 5️⃣ Add deck and workspace links
if ! grep -q "Reflexhon Deck" README.md; then
  cat >> README.md << 'EOF'

---

### 🌐 Reflexhon Live Links
🔗 [Reflexhon Deck (HTML)](https://sahidattaf.github.io/reflexhon-global/reflexhon_deck.html)  
📘 [Reflexhon Workspace (Markdown)](./public/reflexhon_workspace.md)

EOF
  echo "🔗 Deck and workspace links added to README"
fi

# 6️⃣ Commit and push
git add .
git commit -m "🚀 Launch: Reflexhon Global 2027 branding + GitHub Pages" || true
git push origin main

echo "✅ Commit + push completo.  "
echo "➡️ Now go to: Settings → Pages → Source: main branch / (root)"
echo "Save → wait for deployment → test https://sahidattaf.github.io/reflexhon-global"
echo "🌍 Reflexhon Global is now live!"
