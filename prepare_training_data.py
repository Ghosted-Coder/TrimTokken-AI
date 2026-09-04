import json
import random

input_file = "coding_filtered.jsonl"

with open(input_file, "r", encoding="utf-8") as f:
    data = [json.loads(line) for line in f if line.strip()]

random.seed(42)
random.shuffle(data)

split_index = int(len(data) * 0.9)

train_data = data[:split_index]
val_data = data[split_index:]

with open("train.jsonl", "w", encoding="utf-8") as f:
    for item in train_data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

with open("validation.jsonl", "w", encoding="utf-8") as f:
    for item in val_data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print(f"Total examples: {len(data)}")
print(f"Training examples: {len(train_data)}")
print(f"Validation examples: {len(val_data)}")
print("Saved: train.jsonl and validation.jsonl")
