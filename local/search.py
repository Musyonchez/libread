import re

file_path = "text_files/html_files/Beastmaster And His Almighty System Chapter 31 - An Even More Intense Battle - Babelnovel.html"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Extract all words (alphanumeric only)
words = re.findall(r"\w+", text)

target_word = "lay"

# Search for "lay" and print the next 150 words
for i in range(len(words) - 150):
    if words[i].lower() == target_word:
        print("Found:", words[i])
        print("Next 150 words:\n")
        print(" ".join(words[i + 1 : i + 151]))
        print("\n" + "-" * 80 + "\n")  # separator between matches
