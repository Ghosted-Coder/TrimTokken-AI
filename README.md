npm install

# TrimToken AI — Cost-Aware Dynamic LLM Gateway

**TrimToken AI** is an enterprise-grade intelligent model middleware designed to classify incoming prompt complexity in sub-millisecond time and contrastively route queries to the most cost-efficient LLM without sacrificing response quality.

---

## 🚀 Key Features

1. **CSCR Routing Engine (Cost-Spectrum Contrastive Routing)**:
   - Dynamic k-NN vector similarity and heuristic lexical analysis.
   - Evaluates prompt complexity across 5 tiers: `SIMPLE`, `EXTRACTION`, `REASONING`, `CODE`, and `COMPLEX`.
   - Balances quality vs. cost using the Pareto utility equation:
     $$\text{Score} = (1 - \lambda) \cdot \text{Quality} - \lambda \cdot \text{CostRatio}$$

2. **Full Multi-Domain AI Knowledge Synthesizer**:
   - Delivers in-depth, step-by-step mathematical proofs, working code implementations (Rust, Python, TypeScript, etc.), legal/financial contract analysis, and scientific explanations.
   - Local deterministic synthesis with no third-party API calls or credentials.

3. **Enterprise Financial ROI Modeling**:
   - Real-time cost delta calculations against naive frontier model baselines (e.g. GPT-4o).
   - Interactive annual savings projections for Up To 100M+ queries/month.

4. **Live Observability Stream & Traffic Simulator**:
   - Real-time simulation of production enterprise workloads.
   - Live breakdown of prompt/completion tokens, latency metrics, and per-query budget savings.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Animations), Lucide React, React Markdown.
- **Backend API**: Express v4 full-stack server (`server.ts`) with native Vite middleware and CommonJS bundled distribution (`dist/server.cjs`).
- **AI Engine**: Local deterministic synthesis and optional local routing service; no provider API keys are loaded.
- **API Standard**: OpenAI-compatible `/v1/chat/completions` proxy endpoint.

---

## 📦 API Endpoints

- `GET /api/health` — Gateway status and active LLM engine check.
- `GET /api/models` — Active model registry and dynamic pricing matrix.
- `POST /api/models/update` — Update pricing or active state of registered models.
- `POST /api/generate` — Execute real-time routed query with full explanation response.
- `POST /v1/chat/completions` — OpenAI-compatible chat completion gateway.

---

## 🌐 Public Sharing

- **Public Preview**: Share via Google AI Studio's **Share** button for global access (`ais-pre-...` domain).
