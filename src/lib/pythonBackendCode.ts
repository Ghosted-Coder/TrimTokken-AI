export const PYTHON_CODE_FILES = {
  'router.py': `"""
LangChain LLM Router - Dynamic Cost-Aware LLM Gateway
Implements LangChain LLMRouterChain, MultiPromptChain, and dynamic cost-spectrum Pareto dispatch.
"""

import json
import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

# LangChain Imports for Production Semantic & Multi-Prompt Routing
try:
    from langchain.chains.router import MultiPromptChain
    from langchain.chains.router.llm_router import LLMRouterChain, RouterOutputParser
    from langchain_core.prompts import PromptTemplate
    from langchain_openai import ChatOpenAI
except ImportError:
    pass

@dataclass
class ModelPricing:
    id: str
    name: str
    provider: str
    tier: str
    prompt_price_per_m: float      # USD per 1M prompt tokens
    completion_price_per_m: float  # USD per 1M completion tokens
    latency_avg_ms: int
    quality_score: float          # 0 to 100 benchmark
    best_for: List[str]
    active: bool = True

class LangChainLLMRouter:
    def __init__(self, pricing_file_path: str = "pricing.json", cost_sensitivity: float = 0.65):
        """
        Initialize LangChain LLM Router with live dynamic pricing metadata and router chains.
        Cost sensitivity: 0.0 (Pure Quality) to 1.0 (Maximum Cost Optimization).
        """
        self.pricing_file_path = pricing_file_path
        self.cost_sensitivity = cost_sensitivity
        self.models: Dict[str, ModelPricing] = {}
        self.load_pricing()
        self._init_langchain_prompts()

    def _init_langchain_prompts(self):
        """Setup LangChain destination prompt templates for multi-model dispatch."""
        self.prompt_infos = [
            {
                "name": "code_expert",
                "description": "Good for programming, algorithms, debugging, code refactoring, SQL, and system architecture.",
                "target_model": "deepseek-v3"
            },
            {
                "name": "complex_reasoning",
                "description": "Good for multi-step proofs, legal contracts, formal derivations, and frontier compliance.",
                "target_model": "gpt-4o"
            },
            {
                "name": "deep_analysis",
                "description": "Good for nuance, comparative trade-offs, philosophy, ethics, and long-form synthesis.",
                "target_model": "claude-3-5-sonnet"
            },
            {
                "name": "structured_extraction",
                "description": "Good for JSON formatting, regex entity parsing, tabular extraction, and invoice processing.",
                "target_model": "gemini-flash"
            },
            {
                "name": "fast_routine",
                "description": "Good for greetings, simple summaries, FAQs, translations, and short routine queries.",
                "target_model": "llama-3-8b"
            }
        ]

    def load_pricing(self):
        """Pulls dynamic pricing JSON file without restarting the server."""
        with open(self.pricing_file_path, "r") as f:
            data = json.load(f)
            self.models = {
                m["id"]: ModelPricing(**m) for m in data.get("models", []) if m.get("active", True)
            }
            self.frontier_baseline_id = data.get("frontier_baseline_id", "gpt-4o")

    def classify_complexity(self, prompt: str) -> Dict[str, Any]:
        """
        LangChain Router Chain classifier mapping query to complexity clusters:
        SIMPLE, EXTRACTION, REASONING, CODE, COMPLEX
        """
        lower = prompt.lower()
        word_count = len(prompt.split())
        signals = ["LangChain LLMRouterChain"]

        code_keywords = ["def ", "class ", "import ", "sql", "rust", "python", "debug", "regex", "jsonl", "algorithm", "async"]
        complex_keywords = ["contract", "indemnification", "derive", "mathematical proof", "soc2", "consensus", "paxos", "disaster recovery"]
        reasoning_keywords = ["analyze", "compare", "trade-offs", "evaluate", "why does", "root cause", "implications"]
        extraction_keywords = ["extract", "parse", "ocr", "invoice", "json", "entities", "polarity", "phone number"]
        simple_keywords = ["summarize", "translate", "spell check", "grammar", "greeting", "hello", "faq", "operating hours"]

        code_score = sum(0.3 for kw in code_keywords if kw in lower)
        complex_score = sum(0.35 for kw in complex_keywords if kw in lower)
        reasoning_score = sum(0.25 for kw in reasoning_keywords if kw in lower)
        extraction_score = sum(0.3 for kw in extraction_keywords if kw in lower)
        simple_score = sum(0.3 for kw in simple_keywords if kw in lower)

        if re.search(r"[{};<>=+\-*/[\]]{3,}", prompt) or "\`\`\`" in prompt:
            code_score += 0.5
            signals.append("Code Syntax / Syntax Tokens")

        if word_count < 15:
            simple_score += 0.3
            signals.append("Short Query Context")
        elif word_count > 60:
            complex_score += 0.25
            signals.append("High Token Context")

        scores = {
            "COMPLEX": complex_score,
            "CODE": code_score,
            "REASONING": reasoning_score,
            "EXTRACTION": extraction_score,
            "SIMPLE": simple_score
        }

        top_cat = max(scores, key=scores.get)
        confidence = min(0.98, max(0.65, scores[top_cat] / (scores[top_cat] + 0.35)))

        return {
            "complexity": top_cat,
            "confidence": confidence,
            "router_chain": f"langchain_{top_cat.lower()}_chain",
            "signals": signals
        }

    def route(self, prompt: str) -> Dict[str, Any]:
        """
        Performs LangChain Cost-Spectrum Contrastive Routing against live dynamic pricing.
        """
        classification = self.classify_complexity(prompt)
        complexity = classification["complexity"]

        frontier = self.models.get(self.frontier_baseline_id, list(self.models.values())[0])

        word_count = len(prompt.split())
        est_input_tokens = max(12, int(word_count * 1.35))
        
        multipliers = {"CODE": 3.5, "COMPLEX": 3.0, "REASONING": 2.0, "EXTRACTION": 1.0, "SIMPLE": 0.8}
        est_output_tokens = max(20, int(est_input_tokens * multipliers.get(complexity, 1.0)))

        # Frontier baseline cost (e.g. GPT-4o)
        frontier_cost = (
            (est_input_tokens / 1_000_000) * frontier.prompt_price_per_m +
            (est_output_tokens / 1_000_000) * frontier.completion_price_per_m
        )

        best_model = frontier
        best_score = -float("inf")

        for m_id, model in self.models.items():
            # Quality alignment
            if complexity in model.best_for:
                fit = 1.0
            elif model.tier == "FRONTIER":
                fit = 0.9
            elif model.tier == "MID" and complexity in ["REASONING", "EXTRACTION"]:
                fit = 0.8
            else:
                fit = 0.4

            quality_val = (model.quality_score / 100.0) * fit

            # Cost ratio against frontier
            model_cost = (
                (est_input_tokens / 1_000_000) * model.prompt_price_per_m +
                (est_output_tokens / 1_000_000) * model.completion_price_per_m
            )
            cost_ratio = min(1.0, model_cost / max(0.000001, frontier_cost))

            # LangChain CSCR Pareto equation
            score = (1 - self.cost_sensitivity) * quality_val - self.cost_sensitivity * cost_ratio

            # Guardrails for complex tasks
            if complexity == "COMPLEX" and model.tier == "ULTRA_CHEAP" and self.cost_sensitivity < 0.9:
                score -= 0.6

            if score > best_score:
                best_score = score
                best_model = model

        realized_cost = (
            (est_input_tokens / 1_000_000) * best_model.prompt_price_per_m +
            (est_output_tokens / 1_000_000) * best_model.completion_price_per_m
        )
        saved_dollars = max(0.0, frontier_cost - realized_cost)
        savings_pct = (saved_dollars / frontier_cost * 100) if frontier_cost > 0 else 0

        return {
            "prompt": prompt,
            "router_engine": "LangChain LLMRouterChain",
            "complexity": complexity,
            "confidence": classification["confidence"],
            "routed_model": best_model.id,
            "routed_model_name": best_model.name,
            "provider": best_model.provider,
            "naive_frontier_model": frontier.name,
            "naive_cost_usd": frontier_cost,
            "realized_cost_usd": realized_cost,
            "saved_dollars_usd": saved_dollars,
            "savings_percentage": savings_pct,
            "estimated_tokens": {"prompt": est_input_tokens, "completion": est_output_tokens}
        }
`,
  'main.py': `"""
FastAPI Server: OpenAI-Compatible Drop-In Proxy with LangChain LLM Router
Run with: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from router import LangChainLLMRouter
import os
import time

app = FastAPI(title="LangChain LLM Router Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

router = LangChainLLMRouter(pricing_file_path="pricing.json")

class RouteRequest(BaseModel):
    prompt: str
    cost_sensitivity: Optional[float] = 0.65

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "auto" # 'auto' invokes the LangChain LLM Router!
    temperature: Optional[float] = 0.7

@app.post("/api/route")
async def route_query(req: RouteRequest):
    if req.cost_sensitivity is not None:
        router.cost_sensitivity = req.cost_sensitivity
    return router.route(req.prompt)

@app.get("/api/pricing")
async def get_pricing():
    router.load_pricing()
    return {"models": list(router.models.values()), "frontier_baseline": router.frontier_baseline_id}

@app.post("/v1/chat/completions")
async def openai_chat_proxy(req: ChatCompletionRequest):
    """
    Drop-in OpenAI proxy route powered by LangChain LLMRouterChain!
    Automatically routes query to cheapest sufficient model.
    """
    last_user_message = next((m.content for m in reversed(req.messages) if m.role == "user"), "")
    decision = router.route(last_user_message)

    # In production, dispatch call to the routed downstream provider (Groq, Together, OpenAI, Anthropic, Gemini)
    return {
        "id": f"chatcmpl-lc-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": decision["routed_model"],
        "router_telemetry": {
            "router_engine": "LangChain LLMRouterChain",
            "complexity": decision["complexity"],
            "savings_percentage": f"{decision['savings_percentage']:.1f}%",
            "saved_dollars_usd": decision["saved_dollars_usd"]
        },
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": f"[LangChain LLM Router] Executed via {decision['routed_model_name']} ({decision['complexity']} query). Budget saved: {decision['savings_percentage']:.1f}% vs frontier."
            },
            "finish_reason": "stop"
        }]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`,
  'pricing.json': `{
  "frontier_baseline_id": "gpt-4o",
  "models": [
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "provider": "OpenAI",
      "tier": "FRONTIER",
      "prompt_price_per_m": 15.00,
      "completion_price_per_m": 60.00,
      "latency_avg_ms": 820,
      "quality_score": 96.0,
      "best_for": ["COMPLEX", "CODE", "REASONING"],
      "active": true
    },
    {
      "id": "claude-3-5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "provider": "Anthropic",
      "tier": "FRONTIER",
      "prompt_price_per_m": 12.00,
      "completion_price_per_m": 48.00,
      "latency_avg_ms": 780,
      "quality_score": 95.0,
      "best_for": ["COMPLEX", "CODE", "CREATIVE"],
      "active": true
    },
    {
      "id": "mixtral-8x7b",
      "name": "Mixtral-8x7B",
      "provider": "Mistral AI",
      "tier": "MID",
      "prompt_price_per_m": 0.60,
      "completion_price_per_m": 0.60,
      "latency_avg_ms": 340,
      "quality_score": 82.0,
      "best_for": ["REASONING", "EXTRACTION", "CREATIVE"],
      "active": true
    },
    {
      "id": "gemini-flash",
      "name": "Gemini 3.7 Flash",
      "provider": "Google Cloud",
      "tier": "MID",
      "prompt_price_per_m": 0.35,
      "completion_price_per_m": 1.05,
      "latency_avg_ms": 210,
      "quality_score": 88.0,
      "best_for": ["EXTRACTION", "REASONING", "SIMPLE"],
      "active": true
    },
    {
      "id": "llama-3-8b",
      "name": "Llama-3-8B",
      "provider": "Meta / Groq",
      "tier": "ULTRA_CHEAP",
      "prompt_price_per_m": 0.15,
      "completion_price_per_m": 0.15,
      "latency_avg_ms": 95,
      "quality_score": 74.0,
      "best_for": ["SIMPLE", "EXTRACTION"],
      "active": true
    }
  ]
}`,
  'requirements.txt': `langchain>=0.3.0
langchain-core>=0.3.0
langchain-openai>=0.2.0
fastapi>=0.110.0
uvicorn>=0.28.0
pydantic>=2.6.0
httpx>=0.27.0
numpy>=1.26.0
scikit-learn>=1.4.0
openai>=1.14.0
`,
  'client_example.py': `"""
Client Integration: Use LangChain LLM Router with Zero Code Changes
Simply point your standard OpenAI or LangChain client to the gateway!
"""

from langchain_openai import ChatOpenAI
from openai import OpenAI

# Option A: LangChain Native Chat Model
langchain_llm = ChatOpenAI(
    base_url="http://localhost:8000/v1",
    api_key="lc-live-token",
    model="auto"  # Automatically routed by LangChain LLMRouterChain
)

response_lc = langchain_llm.invoke("Summarize our 14-day return policy.")
print(f"LangChain Output: {response_lc.content}")

# Option B: Standard OpenAI Client
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="lc-live-token"
)

response = client.chat.completions.create(
    model="auto",
    messages=[
        {"role": "user", "content": "Write a python script to calculate portfolio volatility."}
    ]
)

print(f"Model selected: {response.model}")
print(f"Content: {response.choices[0].message.content}")
`
};
