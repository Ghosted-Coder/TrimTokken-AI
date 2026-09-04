from datasets import load_dataset
import json

print("Dataset download/load ho raha hai...")

ds = load_dataset("codeparrot/apps", split="train")

print("Dataset load ho gaya!")
print("Total examples:", len(ds))

sample = next(iter(ds))

# Dataset mein solutions aur input_output text format mein ho sakte hain.
# Unhe Python object mein convert kar rahe hain.

if isinstance(sample["solutions"], str):
    sample["solutions"] = json.loads(sample["solutions"])

if isinstance(sample["input_output"], str):
    sample["input_output"] = json.loads(sample["input_output"])

print("\n========== SAMPLE ==========\n")
print(sample)

print("\n========== QUESTION ==========\n")
print(sample["question"])

print("\n========== DIFFICULTY ==========\n")
print(sample["difficulty"])

print("\n========== URL ==========\n")
print(sample["url"])

print("\n========== FIRST SOLUTION ==========\n")
if sample["solutions"]:
    print(sample["solutions"][0])
else:
    print("Is sample mein solution available nahi hai.")
print("\n========== FIRST SOLUTION ==========\n")

if len(sample["solutions"]) > 0:
    print(sample["solutions"][0])
else:
    print("Is sample mein solution available nahi hai.")