import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

BASE_MODEL = "Qwen/Qwen2.5-Coder-0.5B-Instruct"
ADAPTER_PATH = "./qwen-coder-lora"

device = "mps" if torch.backends.mps.is_available() else "cpu"

print("Loading small coding model on:", device)

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float32,
)

model = PeftModel.from_pretrained(
    base_model,
    ADAPTER_PATH,
)

model = model.to(device)
model.eval()

print("Small coding model loaded successfully.")


def generate_code(prompt: str) -> str:
    messages = [
        {
            "role": "user",
            "content": prompt,
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
            max_new_tokens=300,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )

    generated_tokens = outputs[0][inputs["input_ids"].shape[1]:]

    answer = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True,
    )

    return answer


if __name__ == "__main__":
    question = "Write a Python function to reverse a string."

    answer = generate_code(question)

    print("\nQUESTION:")
    print(question)

    print("\nMODEL ANSWER:")
    print(answer)