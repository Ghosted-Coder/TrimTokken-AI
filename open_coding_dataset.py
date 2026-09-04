from datasets import load_dataset

print("Dataset load ho raha hai...")

ds = load_dataset(
    "OpenDCAI/dataflow-instruct-10k",
    split="train"
)

ds = ds.select(range(min(5000, len(ds))))

print("Dataset load ho gaya!")
print("Total examples:", len(ds))
print("Columns:", ds.column_names)

print("\nFIRST EXAMPLE:\n")
print(ds[0])
import json

with open("coding_5000.jsonl", "w", encoding="utf-8") as f:
    for example in ds:
        f.write(json.dumps(example, ensure_ascii=False) + "\n")

print("File save ho gayi: coding_5000.jsonl")