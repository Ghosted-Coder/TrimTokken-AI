import express from 'express';
import path from 'path';
import fs from 'fs';
import { generateComprehensiveAnswer } from './src/lib/knowledgeSynthesizer';
import { classifyQueryComplexity } from './src/lib/routerEngine';

type DynamicModel = {
  id: string;
  name: string;
  provider: string;
  tier: string;
  promptPricePerM: number;
  completionPricePerM: number;
  latencyAvgMs: number;
  qualityScore: number;
  bestFor: string[];
  active: boolean;
  hasKey: boolean;
  color: string;
};

const localModels: DynamicModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'FRONTIER', promptPricePerM: 15, completionPricePerM: 60, latencyAvgMs: 820, qualityScore: 96, bestFor: ['COMPLEX', 'CODE', 'REASONING'], active: false, hasKey: false, color: '#ffba20' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tier: 'FRONTIER', promptPricePerM: 12, completionPricePerM: 48, latencyAvgMs: 780, qualityScore: 95, bestFor: ['COMPLEX', 'CODE', 'CREATIVE'], active: false, hasKey: false, color: '#abc7ff' },
  { id: 'mixtral-8x7b', name: 'Mixtral-8x7B', provider: 'Mistral AI (Groq)', tier: 'MID', promptPricePerM: 0.6, completionPricePerM: 0.6, latencyAvgMs: 340, qualityScore: 82, bestFor: ['REASONING', 'EXTRACTION', 'CREATIVE'], active: false, hasKey: false, color: '#00e639' },
  { id: 'gemini-flash', name: 'Gemini 3.7 Flash', provider: 'Google Cloud', tier: 'MID', promptPricePerM: 0.35, completionPricePerM: 1.05, latencyAvgMs: 210, qualityScore: 88, bestFor: ['EXTRACTION', 'REASONING', 'SIMPLE'], active: false, hasKey: false, color: '#72ff70' },
  { id: 'llama-3-8b', name: 'Llama-3-8B', provider: 'Meta / Groq', tier: 'ULTRA_CHEAP', promptPricePerM: 0.15, completionPricePerM: 0.15, latencyAvgMs: 95, qualityScore: 74, bestFor: ['SIMPLE', 'EXTRACTION'], active: false, hasKey: false, color: '#00ff41' },
  { id: 'deepseek-v3', name: 'DeepSeek-V3', provider: 'DeepSeek', tier: 'MID', promptPricePerM: 0.27, completionPricePerM: 1.1, latencyAvgMs: 310, qualityScore: 91, bestFor: ['CODE', 'REASONING', 'EXTRACTION'], active: false, hasKey: false, color: '#00e5ff' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba Cloud (Qwen API)', tier: 'MID', promptPricePerM: 0.35, completionPricePerM: 1.2, latencyAvgMs: 340, qualityScore: 93, bestFor: ['CODE', 'REASONING', 'COMPLEX'], active: false, hasKey: false, color: '#00C9E8' },
  { id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B', provider: 'Alibaba Cloud (Qwen API)', tier: 'MID', promptPricePerM: 0.2, completionPricePerM: 0.6, latencyAvgMs: 250, qualityScore: 92, bestFor: ['CODE', 'EXTRACTION'], active: false, hasKey: false, color: '#38efff' },
];

let dynamicModels = localModels.map(model => ({ ...model }));

function synthesizeDirectAnswer(prompt: string, complexity?: string, modelName?: string, provider?: string): string {
  return generateComprehensiveAnswer(prompt, complexity, modelName, provider);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: '256kb' }));

  app.get(['/healthz', '/_health', '/api/health'], (_req, res) => {
    res.status(200).json({
      status: 'ok',
      configuredProviders: {
        gemini: false,
        openai: false,
        anthropic: false,
        deepseek: false,
        groq: false,
        qwen: false,
      },
      mode: 'local-only',
      time: new Date().toISOString(),
    });
  });

  app.get('/api/models', (_req, res) => {
    res.json({
      frontier_baseline_id: 'gpt-4o',
      models: dynamicModels,
    });
  });

  app.post('/api/route', async (req, res) => {
    const question = typeof req.body?.question === 'string' ? req.body.question : '';

    try {
      const response = await fetch('http://127.0.0.1:8000/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const body = await response.text();
      if (!response.ok) {
        throw new Error(`Local router returned HTTP ${response.status}`);
      }
      res.status(response.status).type('application/json').send(body);
    } catch (error) {
      console.warn('Local fine-tuned router unavailable; using deterministic fallback route.', error);
      const complexity = classifyQueryComplexity(question).complexity;
      const fallbackMap: Record<string, string> = {
        SIMPLE: 'llama-3-8b',
        EXTRACTION: 'gemini-flash',
        REASONING: 'deepseek-v3',
        CODE: 'qwen-2.5-coder-32b',
        CREATIVE: 'claude-3-5-sonnet',
        COMPLEX: 'gpt-4o',
      };

      res.status(200).json({
        model_id: fallbackMap[complexity] || 'gpt-4o',
        reason: 'Local router unavailable; deterministic fallback selected.',
        complexity,
        router: 'fallback',
      });
    }
  });

  app.post('/api/models/update', (req, res) => {
    const { modelId, promptPricePerM, completionPricePerM, active } = req.body;
    const model = dynamicModels.find(item => item.id === modelId);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    if (typeof promptPricePerM === 'number') model.promptPricePerM = promptPricePerM;
    if (typeof completionPricePerM === 'number') model.completionPricePerM = completionPricePerM;
    if (typeof active === 'boolean') model.active = active;
    res.json({ success: true, updatedModel: model, allModels: dynamicModels });
  });

  app.post('/api/generate', (req, res) => {
    const startTime = Date.now();
    const { prompt, modelId, modelName, provider, complexity } = req.body ?? {};
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'A non-empty prompt is required.' });
    }
    if (prompt.length > 100_000) {
      return res.status(413).json({ error: 'Prompt exceeds the 100,000 character limit.' });
    }

    const targetModelTitle = modelName || modelId || 'TrimToken Local Synthesizer';
    const directAnswer = synthesizeDirectAnswer(prompt, complexity, targetModelTitle, provider);
    res.json({
      text: directAnswer,
      modelUsed: `${targetModelTitle} (local simulation)`,
      liveApi: false,
      promptTokens: Math.max(12, Math.round(prompt.length / 4)),
      completionTokens: Math.max(20, Math.round(directAnswer.length / 4)),
      executionTimeMs: Date.now() - startTime + 45,
    });
  });

  app.post('/v1/chat/completions', (req, res) => {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const lastMsg = messages[messages.length - 1]?.content || 'Hello';
    const answer = synthesizeDirectAnswer(typeof lastMsg === 'string' ? lastMsg : 'Hello');

    res.json({
      id: `chatcmpl-local-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'trimtoken-local-router',
      router_meta: {
        status: 'ROUTED',
        router_engine: 'TrimToken deterministic router',
        routed_model: 'local-synthesizer',
        cost_savings: '100% provider API spend avoided',
      },
      choices: [{
        index: 0,
        message: { role: 'assistant', content: answer },
        finish_reason: 'stop',
      }],
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrimToken local-only gateway running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
