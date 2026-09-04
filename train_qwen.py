import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
)
from peft import LoraConfig, get_peft_model

# -----------------------------
# Settings
# -----------------------------
MODEL_NAME = "Qwen/Qwen2.5-Coder-0.5B-Instruct"
TRAIN_FILE = "train.jsonl"
OUTPUT_DIR = "./qwen-coder-lora"

device = "mps" if torch.backends.mps.is_available() else "cpu"

print("Using device:", device)
print("Loading dataset...")

# -----------------------------
# Load dataset
# -----------------------------
dataset = load_dataset(
    "json",
    data_files=TRAIN_FILE,
    split="train",
)

# Keep only a small amount for the first test
dataset = dataset.select(range(min(300, len(dataset))))

print("Training examples:", len(dataset))

# -----------------------------
# Load tokenizer and model
# -----------------------------
print("Loading model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float32,
)

# -----------------------------
# LoRA configuration
# -----------------------------
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=[
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# -----------------------------
# Convert conversations to text
# -----------------------------
def format_example(example):
    messages = []

    for message in example["conversations"]:
        role = message["from"]
        content = message["value"]

        if role == "human":
            messages.append(
                {
                    "role": "user",
                    "content": content,
                }
            )
        elif role in ["gpt", "assistant"]:
            messages.append(
                {
                    "role": "assistant",
                    "content": content,
                }
            )

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=False,
    )

    return {"text": text}


dataset = dataset.map(format_example)

# -----------------------------
# Tokenize
# -----------------------------
def tokenize_example(example):
    return tokenizer(
        example["text"],
        truncation=True,
        max_length=512,
    )


tokenized_dataset = dataset.map(
    tokenize_example,
    batched=False,
    remove_columns=dataset.column_names,
)

# -----------------------------
# Training
# -----------------------------
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=1,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    learning_rate=2e-4,
    logging_steps=5,
    save_strategy="epoch",
    report_to="none",
    fp16=False,
    bf16=False,
    
)

data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    data_collator=data_collator,
)

print("Starting training...")

trainer.train()

print("Saving LoRA adapter...")

model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print("Training completed successfully.")
print("Saved to:", OUTPUT_DIR)