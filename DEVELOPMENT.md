# 🚀 Reflexhon Global — Phase 1 Development Guide

Welcome to Phase 1 of Reflexhon Global! This guide walks you through setting up your local development environment, understanding the project structure, and contributing to the ecosystem.

## 📋 Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **Git** ([download](https://git-scm.com/))
- **VS Code** ([download](https://code.visualstudio.com/)) — *recommended*
- **GitHub account** — for cloning and contributing

## 🔧 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sahidattaf/reflexhon-global.git
cd reflexhon-global
```

### 2. Install Dependencies

```bash
npm install
```

This installs minimal dependencies for Phase 1:
- `serve` — for serving static assets locally

### 3. Start Development Server

```bash
npm run dev
```

This runs `npx serve public/` on port `3000`.  
**Visit**: [http://localhost:3000](http://localhost:3000)

### 4. Validate Changes

Before committing, run:

```bash
npm run validate
```

This executes `setup_reflexhon_launch.sh` to verify branding assets and GitHub Pages readiness.

## 📁 Project Structure (Phase 1)

```
reflexhon-global/
├── public/                           # Public assets (served via GitHub Pages)
│   ├── index.html                    # Landing page
│   ├── reflexhon_logo_dark.svg       # Dark logo
│   ├── reflexhon_logo_light.svg      # Light logo
│   ├── reflexhon_favicon.png         # Browser favicon
│   └── README.md                     # Asset guidelines
│
├── ai/
│   ├── datasets/
│   │   └── data.jsonl                # Training data (Papiamentu QA pairs)
│   └── models/
│       └── README.md                 # Model layer descriptions
│
├── huggingface/                      # HuggingFace model registry mirror
│   ├── datasets/
│   │   └── data.jsonl                # HF-synced training data
│   └── models/
│       └── README.md
│
├── docs/
│   ├── philosophy/
│   │   └── reflexhon_methodology.md  # Core persona & values
│   ├── guides/
│   │   ├── reflexhon_slack_guide.md  # Team channels & workflows
│   │   └── reflexhon_workspace.md    # Product roadmap & KPIs
│   ├── integration/
│   │   └── Reflexhon_GoogleAI_Integration.md  # Gemini API sprints
│   ├── reflexhon_deck.html           # Presentation deck
│   └── reflexhon_embed.html          # Embeddable widget
│
├── .github/
│   └── copilot-instructions.md       # AI agent guidelines
│
├── package.json                      # NPM manifest & scripts
├── setup_reflexhon_launch.sh         # GitHub Pages deployment script
├── setup_reflexhon_local.md          # (Deprecated — use this guide instead)
├── README.md                         # Ecosystem overview
├── COMMUNITY.md                      # Contributor roles
├── CODE_OF_CONDUCT.md                # Behavioral standards
└── LICENSE                           # MIT License
```

## 🎯 Common Development Tasks

### Add Training Data

1. **Open** `ai/datasets/data.jsonl`
2. **Add** a new line with Papiamentu Q&A:
   ```jsonl
   {"id": "papiamentu_011", "input": "...", "output": "..."}
   ```
3. **Sync** to `huggingface/datasets/data.jsonl`
4. **Commit**:
   ```bash
   git add ai/datasets/data.jsonl huggingface/datasets/data.jsonl
   git commit -m "📚 Add: papiamentu_011 training example"
   ```

### Update Landing Page

1. **Edit** `public/index.html`
2. **Test** locally: `npm run dev` → [http://localhost:3000](http://localhost:3000)
3. **Check** styling consistency (colors, fonts, responsiveness)
4. **Commit**:
   ```bash
   git add public/index.html
   git commit -m "🎨 Update: hero section messaging"
   ```

### Add Branding Assets

1. **Create** logo/icon in your design tool (Figma, Inkscape, etc.)
2. **Export** as SVG or PNG to `public/`
3. **Create metadata** sidecar JSON (see [public/README.md](public/README.md))
4. **Update** `public/index.html` if needed
5. **Commit**:
   ```bash
   git add public/reflexhon_*.{svg,png,json}
   git commit -m "🎨 Add: [asset name] with metadata"
   ```

### Deploy to GitHub Pages

1. **Push** to `main` branch:
   ```bash
   git push origin main
   ```

2. **Run validation** (optional):
   ```bash
   npm run validate
   ```

3. **Visit** [https://sahidattaf.github.io/reflexhon-global/](https://sahidattaf.github.io/reflexhon-global/) after 1–2 minutes

---

## 🧠 Reflexhon Development Principles

### Before Code
Ask yourself:
- ✅ **Does this amplify creator value?** (economic + educational + human)
- ✅ **Is it culturally respectful?** (Papiamentu/Caribbean contexts, no discrimination)
- ✅ **Is the reasoning transparent?** (chain-of-thought, sources, biases logged)
- ✅ **Does it honor the Reflection Loop?** (self-check before delivery)

### During Development
- 📝 **Use bilingual commits**: English + Papiamentu emoji labels
  - `📚 Add:` — New content
  - `🎨 Update:` — Design/styling changes
  - `🐛 Fix:` — Bug fixes
  - `📖 Docs:` — Documentation updates
  - `♻️ Refactor:` — Code restructuring

- 🧠 **Reflect on decisions**: Why this structure? How does it serve creators?
- 🌍 **Respect local languages**: Papiamentu is primary in training data
- 💚 **Human-centered**: Always validate impact on communities

### After Development
- ✅ Run `npm run validate` before pushing
- ✅ Test on [http://localhost:3000](http://localhost:3000) if touching UI
- ✅ Verify commit messages are clear and meaningful
- ✅ Push to `main` and monitor GitHub Pages deployment

---

## 📖 Further Reading

| Resource | Purpose |
|----------|---------|
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | AI agent guidelines |
| [docs/philosophy/reflexhon_methodology.md](docs/philosophy/reflexhon_methodology.md) | Core persona & reflection loop |
| [docs/guides/reflexhon_workspace.md](docs/guides/reflexhon_workspace.md) | Product roadmap & KPIs |
| [COMMUNITY.md](COMMUNITY.md) | Contribution roles & tools |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Behavioral standards |

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
npm run serve -- --listen 3001
```

### Changes Not Reflecting on GitHub Pages
- Wait 1–2 minutes for GitHub Pages rebuild
- Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R`)
- Check [Repository Settings → Pages → Source](https://github.com/sahidattaf/reflexhon-global/settings/pages)

### npm Install Fails
```bash
rm package-lock.json
npm cache clean --force
npm install
```

### Git Commit Issues
- Ensure you're on the `main` branch: `git branch`
- Pull latest: `git pull origin main`
- Try again: `git commit -m "..."`

---

## 🤝 Ready to Contribute?

1. **Review** [COMMUNITY.md](COMMUNITY.md) for your role (Developer, Creator, Educator, etc.)
2. **Read** [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — respect & inclusivity required
3. **Pick a task** from [docs/guides/reflexhon_workspace.md](docs/guides/reflexhon_workspace.md) (Phase 1 checklist)
4. **Create a branch**: `git checkout -b feature/your-feature-name`
5. **Make changes** following the principles above
6. **Open a Pull Request** with clear description
7. **Celebrate** — your contribution powers the Reflexhon economy! 🎉

---

**Last updated**: 2025-12-28  
**Phase**: 1 (Prototype/MVP)  
**Next**: Phase 2 (2026) — Full npm stack, TypeScript, Google Gemini, ReflexCoin tokenomics
