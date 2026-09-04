import json
import re

input_file = "coding_5000.jsonl"
output_file = "coding_filtered.jsonl"

coding_keywords = [
    "python", "javascript", "typescript", "java", "c++", "c#", "rust",
    "code", "coding", "program", "function", "class", "algorithm",
    "debug", "bug", "api", "sql", "html", "css", "react", "node",
    "error", "compile", "variable", "loop", "array", "binary",
    "leetcode", "github", "regex", "json", "database"
]

kept = 0
total = 0

with open(input_file, "r", encoding="utf-8") as infile, \
     open(output_file, "w", encoding="utf-8") as outfile:

    for line in infile:
        total += 1
        item = json.loads(line)

        conversations = item.get("conversations", [])
        text = " ".join(
            message.get("value", "")
            for message in conversations
        ).lower()

        if any(re.search(rf"\b{re.escape(keyword)}\b", text)
               for keyword in coding_keywords):
            outfile.write(json.dumps(item, ensure_ascii=False) + "\n")
            kept += 1

print(f"Total examples: {total}")
print(f"Coding examples kept: {kept}")
print(f"Saved to: {output_file}")
