import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

# Base model used during training
BASE_MODEL = "Qwen/Qwen2.5-Coder-0.5B-Instruct"

# Your trained LoRA adapter
ADAPTER_PATH = "./qwen-coder-lora"

# Use Apple Silicon GPU if available
device = "mps" if torch.backends.mps.is_available() else "cpu"

print("Using device:", device)
print("Loading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

print("Loading base model...")

model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float32,
)

print("Loading trained LoRA adapter...")

model = PeftModel.from_pretrained(
    model,
    ADAPTER_PATH,
)

model = model.to(device)
model.eval()

# Test question
question = "Write a Python function to reverse a linked list. Explain the time complexity."

messages = [
    {
        "role": "user",
        "content": question,
    }
]

prompt = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
)

inputs = tokenizer(
    prompt,
    return_tensors="pt",
).to(device)

print("\nGenerating answer...\n")

with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=200,
        do_sample=False,
        temperature=0.2,
        pad_token_id=tokenizer.eos_token_id,
    )

# Remove the original prompt from the output
generated_tokens = outputs[0][inputs["input_ids"].shape[1]:]

answer = tokenizer.decode(
    generated_tokens,
    skip_special_tokens=True,
)

print("QUESTION:")
print(question)

print("\nMODEL ANSWER:")
print(answer)