import os

from text_file_names_100 import TEXT_FILE_NAMES

# Set your target folder path inside "text_files"
TARGET_FOLDER = os.path.join("text_files", "hundredtxt_files")

# Create the folder if it doesn't exist
os.makedirs(TARGET_FOLDER, exist_ok=True)

# Create each file
for name in TEXT_FILE_NAMES:
    file_path = os.path.join(TARGET_FOLDER, f"{name}.txt")
    with open(file_path, "w") as f:
        f.write(f"This is the file for {name.replace('_', ' ').title()}.\n")
