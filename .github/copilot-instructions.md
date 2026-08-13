# 🧠 Reflexhon Global — AI Coding Agent Instructions

## Architecture Overview

**Reflexhon Global 2027** is a **human-centered AI ecosystem** with three core layers:

1. **ReflexCore** — Reasoning/Creative/Empathetic AI layers with self-reflection
2. **ReflexCoin** — Ethical token for contributor rewards (creators, developers, educators)
3. **ReflexMarket** — Marketplace for prompts, models, assets; 80/20 creator/DAO split

### Value Circle
`Creators → AI Core → ReflexMarket → Treasury DAO → ReflexCoin → Creators`

### Ecosystem Components
- `/ai/models/` — Reasoning, Creative, Empathy layer definitions
- `/ai/datasets/` — Training data (`data.jsonl`) for local contexts
- `/huggingface/` — HuggingFace model registry & datasets
- `/docs/philosophy/` — Reflexhon Methodology & cultural grounding principles
- `/docs/guides/` — Setup, Slack integration, Workspace architecture
- `/docs/integration/` — Google Gemini AI integration (image/voice/grounding APIs)

---

## Critical Workflows

### Local Development
```bash
npm install
npm run dev
```

⚠️ **Note**: `package.json` does not exist yet; the npm workflow is planned for Phase 2 (2026).  
**Public assets**: Served from `public/` directory (HTML deck, logos, favicon).  
**Build**: Script validation in `setup_reflexhon_launch.sh` for GitHub Pages deployment.

### Project Structure
- **`reflexhon_deck.html`** / **`reflexhon_embed.html`** — Visual presentations/embeds
- **`setup_reflexhon_local.md`** — Node.js v18+ required; NPM for dependency management
- **No `package.json` yet** — This is a docs/configuration-heavy project; likely expanding to full app

### Community & Contribution
- **Roles**: Developers, Creators, Translators, Educators, DAO members (see `COMMUNITY.md`)
- **Code of Conduct**: Respect, inclusivity, no discrimination; Caribbean cultural awareness required (`CODE_OF_CONDUCT.md`)
- **Languages**: Papiamentu/English/Spanish; docs use code-switched style mixing local language with English

---

## Project Conventions & Patterns

### Reflexhon Methodology (Persona Layer)
All AI outputs in this project should embody:
- **Clarity** — Simple, jargon-free explanations
- **Empathy** — Human-centered reasoning, not just efficiency
- **Slow thinking** — Transparent chain-of-thought (see Grounded Reasoning below)
- **Caribbean cultural awareness** — Local contexts, languages, ethical frameworks
- **Respect** — No bias, no discrimination; validate impact on marginalized communities

### Reflection Loop Pattern
AI agents must implement **self-reflection**:
1. Generate initial reasoning/output
2. Self-check: "Is this clear? Empathetic? Creative? Culturally grounded?"
3. Refine output before delivery

**Example**: Image generation includes metadata sidecar JSON with author, license, prompt, edits—enabling audit trails.

### Grounded Reasoning (Fact-Checking)
- Use external APIs when needed (Google Search, Maps, Veo for video understanding)
- Provide transparent references to sources
- Validate against local context/cultural norms
- Audit logs for bias detection

### Data Formats
- **Training data**: `data.jsonl` in `/ai/datasets/` and `/huggingface/` (one JSON object per line)  
  Schema: `{"id": "papiamentu_001", "input": "...", "output": "..."}` — id follows `{language}_{sequence}` convention
- **Metadata**: Sidecar JSON files (e.g., for marketplace assets: author, license, created_at, prompt edits)
- **HTML/Markdown**: Mixed code-switching (Papiamentu ↔ English); respect native speakers' voice

---

## Integration Points

### Google Gemini AI
- **Image Generation**: `@google/generative-ai` SDK (text→image, editing, aspect ratios)
- **Live Voice**: Gemini Live API + STT/TTS for real-time conversation + "Thinking Mode"
- **Grounded Agent**: Google Search + Maps + Veo (video understanding)
- See `/docs/integration/Reflexhon_GoogleAI_Integration.md` for API examples

### ReflexCoin Economy
- Micro-royalties per asset/prompt contribution
- Treasury DAO allocation (20% split) for education/community
- Validate ethical contribution (no harm, cultural respect)

### Slack Integration
- Channel `#🧠-ai-dev` for AI development, reasoning loop, and bug discussion
- Community coordination and contributor onboarding
- See [reflexhon_slack_guide.md](docs/guides/reflexhon_slack_guide.md) for channel taxonomy and workflows

### Notion Integration
- Dashboard for workspace planning, contributor tracking
- Reflection card templates for self-check loops
- DAO voting records

---

## Project Maturity

Reflexhon Global is currently in **Phase 1 (Prototype/MVP)** — a documentation-heavy, community-building phase:

- **Current state**: Markdown docs, HTML decks, JSON data, ethical charters
- **Incoming (Phase 2, 2026)**: Full npm/Node.js stack, TypeScript migration, Gemini API integration, ReflexCoin tokenomics
- **Agents should expect**: To work primarily with Markdown, HTML, SVG logos, and `.jsonl` training data; anticipate architectural changes as product matures
- **No CI/CD yet**: GitHub Actions workflows will be added as build/test requirements emerge

---

## Key Files by Purpose

| File | Purpose |
|------|---------|
| [README.md](README.md) | Ecosystem vision, components, value circle |
| [setup_reflexhon_local.md](setup_reflexhon_local.md) | Dev onboarding, Node.js setup |
| [COMMUNITY.md](COMMUNITY.md) | Contribution roles & tools |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Behavioral standards, respect for diversity |
| [docs/philosophy/reflexhon_methodology.md](docs/philosophy/reflexhon_methodology.md) | Persona, reflection, grounding principles |
| [docs/guides/reflexhon_workspace.md](docs/guides/reflexhon_workspace.md) | Product roadmap, KPIs, ethical charter |
| [docs/integration/Reflexhon_GoogleAI_Integration.md](docs/integration/Reflexhon_GoogleAI_Integration.md) | Sprint-by-sprint tech stack & API examples |

---

## Helpful Context for Agents

- **No TypeScript config yet** — JavaScript/Markdown docs focus; migration likely as product matures
- **Multilingual docs** — Papiamentu is primary; preserve code-switching style in any additions
- **Ethical guardrails first** — Bias audits, privacy middleware, human-in-the-loop review before any model deployment
- **Creator-first mindset** — Always favor sustainable income for contributors over platform profit
- **Notion-native tooling** — Workspace planning via Notion; integrate templates if extending features

---

## Questions Before Contributing

When tasked with new work:
1. **Does this amplify creator value?** (Economic + Educational + Human impact)
2. **Is it culturally respectful?** (Papiamentu/Caribbean contexts, no discrimination)
3. **Is the reasoning transparent?** (Chain-of-thought, sources cited, biases logged)
4. **Does it honor the Reflection Loop?** (Self-check before delivery)

---

*Last updated: 2025-12-28*
