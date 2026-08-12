# Reflexhon Global 2027

Human-centered cultural intelligence for Papiamentu and Caribbean contexts.

> "Amplifiká humanidad, kreatividat i empatia — no pa suplantá hende, pero pa reflehá kultura lokal, pensa, i rasonamentu humano."

## Production baseline

The deployed Cloudflare Worker and the Worker entry point on `main` identify the current API as **v3.0.0 — Cultural Intelligence**.

- Production Worker: <https://reflexhon-global.sahidattaf.workers.dev>
- Health: <https://reflexhon-global.sahidattaf.workers.dev/health>
- API information: <https://reflexhon-global.sahidattaf.workers.dev/api>
- Worker entry point: `worker-v3.js` (configured in `wrangler.toml`)
- Release documentation: `RELEASE_NOTES_v3.0.0.md`

The advanced NLP, emotion, memory, and cultural-scoring modules exist in the repository, but comments in `worker-v3.js` state that they are not fully integrated into the deployed request path. Their presence must not be interpreted as verified production behavior.

## Verified routes

These routes are implemented by `worker-v3.js` on the current `main` baseline:

| Route | Method | Current behavior |
|---|---:|---|
| `/` | GET | Reflexhon Studio UI |
| `/studio` | GET | Reflexhon Studio UI |
| `/analytics` | GET | Analytics UI |
| `/health` | GET | Health and version metadata |
| `/api` | GET | API information |
| `/api/v1/reflexion` | POST | Reflexion request path |
| `/api/v1/datasets` | GET | Cultural dataset list |
| `/api/v1/translate` | POST | Simplified translation response |
| `/api/v1/emotion` | POST | Simplified emotion analysis |
| `/api/v1/analytics` | GET | Simplified analytics response |

Routes described in older v2 documentation are not considered live unless they are present in `worker-v3.js` and verified against production.

## Current validation status

Validation of the `main` commit `1c08c45f91146a1f77ae9f0c72882dbe8f7766b4` on 2026-08-12 produced:

- `npm ci`: completed
- baseline before P0 fixes: repeated test runs observed 2–3 failures among 44 tests
- baseline before P0 fixes: lint reported **483 errors and 64 warnings**
- current P0 branch: **51 passing tests**; lint has **0 errors** with 61 remaining warnings tracked as technical debt
- live `/health`: HTTP 200 and version `3.0.0`
- live `/api`: HTTP 200 and version `3.0.0`

This is a verified branch-level baseline, not a production benchmark. See the P0 priorities below.

## Local setup

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/sahidattaf/reflexhon-global.git
cd reflexhon-global
npm ci
npm test -- --runInBand
npm run lint
```

Run the Node API locally:

```bash
npm start
```

Run the Cloudflare Worker locally:

```bash
npm run deploy:dev
```

## Architecture

The deployed request path currently starts in `worker-v3.js`. The repository also contains an Express implementation (`server.js`, `api/`, `routes/`, and `services/`), creating two runtime paths that need explicit ownership and deduplication.

Desired direction:

```text
request
  -> routing
  -> validation
  -> auth and rate limiting
  -> domain service
  -> cultural and reflexion services
  -> persistence and cache
  -> response formatting
  -> analytics
```

## P0 — truth and reliability

1. Keep version metadata coherent across `package.json`, the lockfile, `/health`, `/api`, README, and release documentation.
2. Document only routes verified in the Worker and live API.
3. Remove or qualify unsupported performance, dataset-count, accuracy, security, and test-pass claims.
4. Protect write, admin, analytics-identity, and user-memory surfaces before exposing them.
5. Fix the failing automated tests and establish an enforceable lint baseline.

## Documentation

- [API overview](docs/api/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](DEPLOYMENT.md)
- [v3.0.0 release notes](RELEASE_NOTES_v3.0.0.md)
- Security and contribution policies are P0 documentation gaps and still need to be added.

Some historical documents may describe earlier implementations or planned behavior. When sources conflict, use this order: live production behavior, current Worker code on `main`, current release documentation, then general project documentation.

## Cultural responsibility

Papiamentu is not treated as simple translation. Dialect, island context, code-switching, cultural nuance, and human correction must remain explicit. Aruba, Bonaire, and Curaçao must not be generalized as one homogeneous culture. Any cultural score must document what it measures, the heuristic or model used, its limitations, and how a person can challenge or correct it.

## License

MIT. See [LICENSE](LICENSE).

---

**Reflection without verification is not sufficient. Evidence, tests, transparency, and cultural respect are required.**
