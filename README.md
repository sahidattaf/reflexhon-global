<p align="center">
  <img src="reflexhon_logo_dark.svg" alt="Reflexhon Logo" width="180"/>
</p>

<h1 align="center">🌍 Reflexhon Global 2027</h1>
<p align="center">
  <i>Human-Centered Intelligence Ecosystem</i><br/>
  <i>Cultural AI Alignment for Papiamentu</i>
</p>

<p align="center">
  <a href="https://github.com/sahidattaf/reflexhon-global/actions">
    <img src="https://github.com/sahidattaf/reflexhon-global/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg" alt="Deployment Status">
  </a>
  <a href="https://reflexhon-global.sahidattaf.workers.dev/health">
    <img src="https://img.shields.io/badge/status-live-success" alt="API Status">
  </a>
  <a href="https://github.com/sahidattaf/reflexhon-global/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://workers.cloudflare.com/">
    <img src="https://img.shields.io/badge/Cloudflare-Workers-orange" alt="Cloudflare Workers">
  </a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-live-api">Live API</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-features">Features</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🎯 What is Reflexhon Global?

**Reflexhon Global** is a production-ready API for **AI cultural alignment**, specifically designed for **Papiamentu** language and Caribbean cultural contexts.

### ✨ Core Mission

> *"Amplifiká humanidad, kreatividat i empatia — no pa suplantá hende, pero pa reflehá kultura lokal, pensa, i rasonamentu humano."*

We're building AI that:
- 🌍 **Reflects** local culture and human reasoning
- 💫 **Amplifies** humanity, creativity, and empathy
- 🧠 **Preserves** linguistic and cultural context
- ⚡ **Delivers** fast, globally-distributed inference

---

## 🚀 Live API

### Production Endpoint
```
https://reflexhon-global.sahidattaf.workers.dev
```

### ⚡ Try It Now!

**Health Check:**
```bash
curl https://reflexhon-global.sahidattaf.workers.dev/health
```

**API Info:**
```bash
curl https://reflexhon-global.sahidattaf.workers.dev/api
```

**Or open in your browser:**
- 🌐 [API Root](https://reflexhon-global.sahidattaf.workers.dev/)
- 💚 [Health Status](https://reflexhon-global.sahidattaf.workers.dev/health)
- 📖 [API Documentation](https://reflexhon-global.sahidattaf.workers.dev/api)

### 📊 Performance
- ⚡ **Response Time**: < 100ms (edge-optimized)
- 🌍 **Global**: Deployed on Cloudflare's network
- 🛡️ **Secure**: DDoS protection & SSL included
- ♾️ **Scalable**: Auto-scales with demand

---

## 🌞 Vision & Philosophy

### The Reflexhon Ecosystem

| Component | Purpose | Impact |
|-----------|---------|--------|
| 🧠 **Reflexhon Core** | Reasoning • Creative • Empathic AI Layers | Human-centered intelligence |
| 💠 **ReflexCoin** | Token for real contributions | Ethical economy |
| 🎨 **ReflexMarket** | Marketplace for prompts, models, assets | Creator income |
| 💎 **Treasury DAO** | Decentralized governance | Fund ethical AI & education |

### 🪞 Value Circle

```
Creators → AI Core → ReflexMarket → Treasury DAO → ReflexCoin → Creators
```

**Generates:**
- 💰 Economic value
- 🧠 Educational value
- 💫 Human value

---

## 🔥 Reflexhon Methodology

### 1️⃣ Persona Layer
AI with consistent identity:
- ✨ **Clarity** - Clear, understandable responses
- 💙 **Empathy** - Emotionally intelligent
- 🐢 **Slow thinking** - Deliberate reasoning
- 🏝️ **Caribbean awareness** - Cultural context
- 🙏 **Respeto** - Respectful communication

### 2️⃣ Reflexhon Reflection Loop
The AI:
1. 🔍 Analyzes its reasoning
2. 🪞 Performs self-reflection
3. ✅ Evaluates output quality
4. ⏸️ Honors pauses in response

---

## 📖 API Endpoints

### Currently Available

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/` | GET | Welcome & API info | ✅ Live |
| `/health` | GET | Health check & status | ✅ Live |
| `/api` | GET | Endpoint documentation | ✅ Live |
| `/api/v1/datasets` | GET | Cultural alignment datasets | 🚧 Coming Soon |
| `/api/v1/reflexion` | GET/POST | Reflexion processing | 🚧 Coming Soon |

### Example Responses

**GET /health**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T01:23:45.678Z",
  "message": "Reflexhon Global API is running on Cloudflare Workers",
  "environment": "production"
}
```

**GET /api**
```json
{
  "success": true,
  "name": "Reflexhon Global API",
  "version": "1.0.0",
  "description": "Cultural Alignment API for Papiamentu",
  "endpoints": {
    "health": "/health",
    "datasets": "/api/v1/datasets",
    "reflexion": "/api/v1/reflexion"
  }
}
```

---

## 🎨 Features

### ✅ Production Ready
- ✨ **Live API** on Cloudflare Workers
- 🔄 **CI/CD Pipeline** via GitHub Actions
- 🧪 **Automated Testing** & linting
- 📚 **Comprehensive Documentation**
- 🛡️ **CORS Enabled** for browser access
- ⚡ **Edge-Optimized** performance

### 🚧 In Development
- 💾 **D1 Database** integration
- 🗄️ **KV Caching** layer
- 📊 **Dataset API** endpoints
- 🔄 **Reflexion Processing** engine
- 🔐 **Authentication** system
- 📈 **Analytics Dashboard**

---

## 💻 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/sahidattaf/reflexhon-global.git
cd reflexhon-global

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Start development server
npm run dev

# 5. API runs on http://localhost:3000
```

### Test Locally

```bash
# Run linter
npm run lint

# Run tests
npm test

# Test with Wrangler (Workers environment)
wrangler dev
```

---

## ☁️ Deployment

### Automated (Recommended)

**Push to GitHub:**
```bash
git push origin main
```

**GitHub Actions automatically:**
1. ✅ Runs tests & linting
2. ✅ Deploys to Cloudflare Workers
3. ✅ Verifies deployment

**Deployment triggers:**
- `main` branch → **Production**
- `reflexhon-cloud-v1` branch → **Staging**

### Manual Deployment

```bash
# Deploy to production
wrangler deploy --env production

# Deploy to staging
wrangler deploy --env staging
```

---

## 🏗️ Architecture

```
reflexhon-global/
├── worker.js              # 🚀 Cloudflare Workers entry point (DEPLOYED)
├── server.js              # 💻 Express app (local development)
├── wrangler.toml          # ⚙️ Workers configuration
├── package.json           # 📦 Dependencies & scripts
│
├── .github/workflows/     # 🔄 CI/CD automation
│   └── deploy-cloudflare.yml
│
├── api/                   # 🛤️ API routing
├── routes/                # 📍 Route handlers
├── services/              # 💼 Business logic
├── middleware/            # 🔌 Express middleware
├── utils/                 # 🛠️ Utilities
├── config/                # ⚙️ Configuration
│
├── ai/datasets/           # 📊 Cultural alignment data
│
└── docs/                  # 📚 Documentation
    ├── API.md
    ├── ARCHITECTURE.md
    └── guides/
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Cloudflare Workers (V8 Isolates) |
| **Language** | JavaScript (ES Modules) |
| **Local Dev** | Express.js + Node.js 20 |
| **Database** | Cloudflare D1 (coming soon) |
| **Cache** | Cloudflare KV (coming soon) |
| **CI/CD** | GitHub Actions |
| **Testing** | Jest + ESLint |

---

## 📚 Documentation

### Getting Started
- 📖 [API Documentation](docs/API.md) - Complete API reference
- 🏗️ [Architecture Guide](docs/ARCHITECTURE.md) - System design
- 🚀 [Deployment Setup](docs/guides/DEPLOYMENT_SETUP.md) - Production guide
- ⚡ [Cloudflare Quickstart](docs/guides/CLOUDFLARE_QUICKSTART.md) - Setup guide
- 🔐 [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md) - CI/CD config
- 🌐 [Cloudflare Setup](CLOUDFLARE_SETUP.md) - Quick reference
- 👨‍💻 [Development Guide](CLAUDE.md) - Code patterns & best practices

### Configuration Files
- `wrangler.toml` - Cloudflare Workers config
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server (hot reload)
npm start        # Start production server
npm test         # Run tests (Jest)
npm run lint     # Run linter (ESLint)
```

### Environment Variables

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

See `.env.example` for all options.

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Core API infrastructure
- [x] Cloudflare Workers deployment
- [x] CI/CD pipeline
- [x] Documentation
- [x] Basic endpoints

### 🚧 Phase 2: Data Layer (In Progress)
- [ ] D1 database integration
- [ ] KV caching implementation
- [ ] Dataset API endpoints
- [ ] JSONL data import

### 📋 Phase 3: Intelligence (Planned)
- [ ] Reflexion processing engine
- [ ] Cultural context analysis
- [ ] Papiamentu NLP integration
- [ ] Sentiment analysis

### 🎯 Phase 4: Scale (Future)
- [ ] Authentication & API keys
- [ ] Rate limiting
- [ ] Analytics dashboard
- [ ] Custom domain (api.reflexhon.cloud)
- [ ] Webhook support
- [ ] SDK development

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make** your changes
4. **Test** your code
   ```bash
   npm run lint
   npm test
   ```
5. **Commit** with clear messages
   ```bash
   git commit -m "Add: amazing feature"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open** a Pull Request

### Development Guidelines
- ✅ Follow ESLint rules
- ✅ Write tests for new features
- ✅ Update documentation
- ✅ Keep commits atomic and descriptive
- ✅ Ensure CI/CD passes

See [CLAUDE.md](CLAUDE.md) for detailed development patterns.

---

## 📊 Project Status

| Aspect | Status | Notes |
|--------|--------|-------|
| **Core API** | ✅ Complete | Basic endpoints working |
| **Deployment** | ✅ Live | Cloudflare Workers |
| **CI/CD** | ✅ Active | GitHub Actions |
| **Documentation** | ✅ Complete | 7+ guides available |
| **Testing** | ✅ Setup | ESLint + Jest configured |
| **Database** | 🚧 Planned | D1 integration next |
| **Caching** | 🚧 Planned | KV layer coming |
| **Auth** | 📋 Future | API keys planned |

---

## 🔗 Important Links

### Live Services
- 🌐 **Production API**: https://reflexhon-global.sahidattaf.workers.dev
- 💚 **Health Check**: https://reflexhon-global.sahidattaf.workers.dev/health
- 📖 **API Info**: https://reflexhon-global.sahidattaf.workers.dev/api

### Development
- 📦 **Repository**: https://github.com/sahidattaf/reflexhon-global
- 🔄 **GitHub Actions**: https://github.com/sahidattaf/reflexhon-global/actions
- 🐛 **Issues**: https://github.com/sahidattaf/reflexhon-global/issues
- 🔀 **Pull Requests**: https://github.com/sahidattaf/reflexhon-global/pulls

### Cloudflare
- ☁️ **Workers Dashboard**: https://dash.cloudflare.com
- 📊 **Analytics**: https://dash.cloudflare.com/9a009ef5b0a39e042797e3218c05669c/workers
- 🔑 **API Tokens**: https://dash.cloudflare.com/profile/api-tokens

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Cloudflare** for Workers platform
- **GitHub** for Actions CI/CD
- **Papiamentu community** for cultural context
- **All contributors** who help build this vision

---

## 📞 Support

- 📖 **Documentation**: Check [docs/](docs/) folder
- 🐛 **Issues**: [GitHub Issues](https://github.com/sahidattaf/reflexhon-global/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/sahidattaf/reflexhon-global/discussions)

---

## 🌟 Star History

If you find this project useful, please ⭐ **star** it on GitHub!

---

<p align="center">
  <b>Built with ❤️ for cultural AI alignment</b><br/>
  <sub>Reflexhon Global • 2025 • Papiamentu Cultural AI</sub>
</p>

<p align="center">
  <a href="https://reflexhon-global.sahidattaf.workers.dev">🌐 Visit Live API</a> •
  <a href="docs/API.md">📖 Read Docs</a> •
  <a href="https://github.com/sahidattaf/reflexhon-global/issues/new">🐛 Report Bug</a> •
  <a href="https://github.com/sahidattaf/reflexhon-global/issues/new">✨ Request Feature</a>
</p>

---

**Status**: ✅ Production
**Version**: 1.0.0
**Last Updated**: December 30, 2025
