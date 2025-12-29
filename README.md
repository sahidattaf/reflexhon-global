<p align="center" style="background:black; padding:20px;">
  <img src="reflexhon_logo_dark.svg" alt="Reflexhon Logo" width="180"/>
</p>

<h1 align="center">🌍 Reflexhon Global 2027</h1>
<p align="center"><i>Human-Centered Intelligence Ecosystem</i></p>

<p align="center">
  <a href="https://github.com/sahidattaf/reflexhon-global/actions">
    <img src="https://github.com/sahidattaf/reflexhon-global/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg" alt="Deployment Status">
  </a>
</p>

---

## 🌞 Visión
Reflexhon Global ta un ekosistema AI ku ta amplifiká **humanidad, kreatividat i empatia** — no pa suplantá hende, pero pa reflehá **kultura lokal**, **pensa**, i **rasonamentu humano**.

---

# 🧩 Komponentenan di e Ekosistema

| Layer | Deskripshon | Impacto |
|-------|--------------|----------|
| 🧠 **Reflexhon Core** | Reasoning • Creative • Empathic Layers | Human-centered AI |
| 💠 **ReflexCoin** | Token pa kontribushon real | Ekonomia étiko |
| 🎨 **ReflexMarket** | Marketplace pa prompts, models, assets | Income pa kreatornan |
| 💎 **Treasury DAO** | Gobernashon | Finansia AI étiko i edukashon |

---

# 🪞 Círculo di Valor
**Creators → AI Core → ReflexMarket → Treasury DAO → ReflexCoin → Creators**

Genera:
- 💰 Valor ekonomiko
- 🧠 Valor edukativo
- 💫 Valor humano

---

# 🔥 Reflexhon Methodology — Human-Centered AI

## 1️⃣ Persona Layer
AI ku identidad konsistente:
- clarity
- empathy
- slow thinking
- Caribbean cultural awareness
- respeto

## 2️⃣ Reflexhon Reflection Loop
AI ta:
- analiza su rasonamentu
- hasi self-reflection
- evalua output
- honra un *pausa* den respuesta

---

# 🌎 Reflexhon Global Cloud API

This repository contains the Node.js Express API for cultural alignment training and inference.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📚 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Architecture](docs/ARCHITECTURE.md)** - System design and patterns
- **[Deployment Setup](docs/guides/DEPLOYMENT_SETUP.md)** - Production deployment guide
- **[Cloudflare Setup](CLOUDFLARE_SETUP.md)** - Quick Cloudflare configuration
- **[GitHub Secrets](GITHUB_SECRETS_SETUP.md)** - CI/CD configuration

## 🛠️ Development

### Running Locally

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
```

The API runs on `http://localhost:3000`

### Testing

```bash
# Run all tests
npm test

# Run linter
npm run lint
```

## ☁️ Deployment

### Cloudflare Workers

**Automated deployment via GitHub Actions:**
- Push to `main` → Production deployment
- Push to `reflexhon-cloud-v1` → Staging deployment

**Manual deployment:**
```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

### Setup Guides

1. **[Cloudflare Resources Setup](CLOUDFLARE_SETUP.md)** - Create D1 databases and KV namespaces
2. **[GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md)** - Configure automated deployments
3. **[Deployment Guide](docs/guides/DEPLOYMENT_SETUP.md)** - Complete deployment documentation

## 📖 API Endpoints

### Datasets
- `GET /api/v1/datasets` - List all cultural alignment datasets
- `GET /api/v1/datasets/:id` - Get specific dataset entry

### Reflexion
- `POST /api/v1/reflexion/process` - Process input through reflexion loop
- `POST /api/v1/reflexion/analyze` - Analyze reasoning patterns

See [API Documentation](docs/API.md) for complete reference.

## 🏗️ Architecture

```
reflexhon-global/
├── api/              # API versioning and routing
├── routes/           # Express route handlers
├── services/         # Business logic layer
├── middleware/       # Custom middleware
├── utils/            # Shared utilities
├── config/           # Configuration files
├── ai/datasets/      # JSONL cultural alignment data
└── docs/             # Documentation
```

See [Architecture Documentation](docs/ARCHITECTURE.md) for details.

## 🌐 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Deployment**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQL)
- **Cache**: Cloudflare KV
- **CI/CD**: GitHub Actions

## 🔐 Environment Variables

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

See `.env.example` for complete configuration.

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CLAUDE.md](CLAUDE.md) for development guidelines.

## 📊 Project Status

- ✅ Core API implemented
- ✅ Cultural alignment dataset integration
- ✅ Cloudflare Workers deployment configured
- ✅ CI/CD pipeline set up
- ✅ Comprehensive documentation
- ⏳ D1 database integration (optional)
- ⏳ KV caching layer (optional)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🔗 Links

- **Live API**: https://reflexhon-cloud.workers.dev
- **GitHub Actions**: https://github.com/sahidattaf/reflexhon-global/actions
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Documentation**: [docs/](docs/)

---

<p align="center">
  <b>Built with ❤️ for cultural AI alignment</b>
</p>
