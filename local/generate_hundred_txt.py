import os

from text_file_names_100 import TEXT_FILE_NAMES

# from text_file_names_10 import TEXT_FILE_NAMES

TARGET_FOLDER = os.path.join("text_files", "hundredtxt_files")
# TARGET_FOLDER = os.path.join("text_files", "tentxt_files")

os.makedirs(TARGET_FOLDER, exist_ok=True)

# Create each file with numeric filename only
for i, name in enumerate(TEXT_FILE_NAMES, start=1):
    filename = f"{str(i).zfill(3)}.txt"  # 001.txt, 002.txt, ...
    file_path = os.path.join(TARGET_FOLDER, filename)
    with open(file_path, "w") as f:
        f.write(f"This is the file for {name.replace('_', ' ').title()}.\n")
