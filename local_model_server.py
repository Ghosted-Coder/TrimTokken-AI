import json
import re

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn


BASE_MODEL = "Qwen/Qwen2.5-Coder-0.5B-Instruct"
ADAPTER_PATH = "./qwen-coder-lora"

device = "mps" if torch.backends.mps.is_available() else "cpu"

print("Using device:", device)
print("Loading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

print("Loading base model...")

base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float32,
)

print("Loading trained LoRA adapter...")

model = PeftModel.from_pretrained(
    base_model,
    ADAPTER_PATH,
)

model = model.to(device)
model.eval()

print("Fine-tuned Qwen router loaded successfully!")


app = FastAPI()


class RouteRequest(BaseModel):
    question: str


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "qwen-router",
        "model": "Qwen2.5-Coder-0.5B-Instruct",
        "device": device,
    }


@app.post("/route")
def route_question(request: RouteRequest):

    router_prompt = f"""
You are an AI model routing classifier.

Do not answer the user's question.
Only select which external LLM API should answer it.

Available model IDs:

gpt-4o
claude-3-5-sonnet
gemini-flash
deepseek-v3
qwen-2.5-coder-32b
llama-3-8b

Routing rules:

- Use deepseek-v3 for coding, programming, debugging, mathematics, and technical reasoning.
- Use qwen-2.5-coder-32b for advanced coding and large code tasks.
- Use claude-3-5-sonnet for writing, explanation, creative work, and analysis.
- Use gemini-flash for simple questions, extraction, summarization, and fast responses.
- Use gpt-4o for complex general-purpose reasoning.
- Use llama-3-8b for simple and lightweight questions.

Return ONLY valid JSON.
Do not use markdown.
Do not answer the question.

Required JSON format:
{{
  "model_id": "deepseek-v3",
  "reason": "The question requires programming knowledge",
  "complexity": "CODE"
}}

User question:
{request.question}
"""

    messages = [
        {
            "role": "user",
            "content": router_prompt,
        }
    ]

    formatted_prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
    )

    inputs = tokenizer(
        formatted_prompt,
        return_tensors="pt",
    ).to(device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=100,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )

    generated_tokens = outputs[0][
        inputs["input_ids"].shape[1]:
    ]

    raw_answer = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True,
    ).strip()

    print("Qwen router output:", raw_answer)

    allowed_models = {
        "gpt-4o",
        "claude-3-5-sonnet",
        "gemini-flash",
        "deepseek-v3",
        "qwen-2.5-coder-32b",
        "llama-3-8b",
    }

    try:
        # JSON code block ho to remove karna
        cleaned_answer = re.sub(
            r"```json|```",
            "",
            raw_answer,
            flags=re.IGNORECASE,
        ).strip()

        result = json.loads(cleaned_answer)

        selected_model = result.get("model_id")

        if selected_model not in allowed_models:
            raise ValueError("Invalid model_id returned by Qwen")

        return {
            "model_id": selected_model,
            "reason": result.get("reason", "Selected by fine-tuned Qwen router"),
            "complexity": result.get("complexity", "GENERAL"),
            "router": "qwen-finetuned",
        }

    except Exception as error:
        print("Router output parsing failed:", error)

        return {
            "model_id": "gemini-flash",
            "reason": "Fallback because router output was invalid",
            "complexity": "SIMPLE",
            "router": "fallback",
        }


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
    )