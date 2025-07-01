#!/usr/bin/env python2

import logging
import os
import time

import pyttsx3

# from text_file_names_10 import TEXT_FILE_NAMES
from text_file_names_100 import TEXT_FILE_NAMES

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# Folder and file list
TEXT_FOLDER = os.path.join("text_files", "hundredtxt_files")


# Manually set the starting file name
start_file_name = "003"  # Change this to any from "one" to "ten"

# Determine the starting index
if start_file_name in TEXT_FILE_NAMES:
    current_index = TEXT_FILE_NAMES.index(start_file_name)
else:
    raise ValueError(f"Invalid start file name: {start_file_name}")


def read_text_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        logging.error(f"Failed to read {file_path}: {e}")
        return ""


def speak_content(text_content):
    def speak_with_new_instance(content, attempt):
        """Speaks a given content with a new pyttsx3 instance."""
        local_engine = pyttsx3.init()
        local_engine.setProperty("rate", 300)
        voices = local_engine.getProperty("voices")
        local_engine.setProperty(
            "voice", voices[10].id if len(voices) > 10 else voices[0].id
        )
        local_engine.setProperty("pitch", 1)

        try:
            logging.info(f"Speaking part {attempt}...")
            local_engine.say(content)
            local_engine.runAndWait()
            logging.info(f"Part {attempt} spoken successfully.")
        except Exception as e:
            logging.error(f"Error during speech for part {attempt}: {e}")
        finally:
            local_engine.stop()

    # Split content into four parts
    quarter = len(text_content) // 4
    parts = [
        text_content[:quarter],
        text_content[quarter : quarter * 2],
        text_content[quarter * 2 : quarter * 3],
        text_content[quarter * 3 :],
    ]

    max_retries = 50
    success = [False] * 4

    # Speak all four parts
    for i in range(4):
        for retry in range(max_retries):
            try:
                speak_with_new_instance(parts[i], i + 1)
                success[i] = True
                break
            except Exception as e:
                logging.error(
                    f"Retry {retry + 1}/{max_retries} for part {i + 1} failed: {e}"
                )
                time.sleep(2)

    if not all(success):
        logging.error("Failed to speak one or more parts after multiple attempts.")


# Infinite loop reading and speaking text files in a cycle
while True:
    current_file_name = TEXT_FILE_NAMES[current_index]
    file_path = os.path.join(TEXT_FOLDER, f"{current_file_name}.txt")
    logging.info(f"Reading file: {file_path}")

    content = read_text_file(file_path)
    if content:
        speak_content(content)
    else:
        logging.warning(f"No content in {file_path}, skipping...")

    current_index = (current_index + 1) % len(TEXT_FILE_NAMES)  # Cycle to next file
    time.sleep(1)  # Optional pause between files
