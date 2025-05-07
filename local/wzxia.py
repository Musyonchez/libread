#!/usr/bin/env python3

import logging
import os
import time

import pyttsx3

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# Folder and file list
TEXT_FOLDER = "text_files"
TEXT_FILE_NAMES = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
]

# Manually set the starting file name
start_file_name = "one"  # Change this to any from "one" to "ten"

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
        local_engine.setProperty("rate", 450)
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

    # Split content into two halves
    mid_point = len(text_content) // 2
    first_half = text_content[:mid_point]
    second_half = text_content[mid_point:]

    max_retries = 50
    success_first_half, success_second_half = False, False

    # Speak first half
    for retry in range(max_retries):
        try:
            speak_with_new_instance(first_half, 1)
            success_first_half = True
            break
        except Exception as e:
            logging.error(f"Retry {retry + 1}/{max_retries} for first half failed: {e}")
            time.sleep(2)

    # Speak second half
    for retry in range(max_retries):
        try:
            speak_with_new_instance(second_half, 2)
            success_second_half = True
            break
        except Exception as e:
            logging.error(
                f"Retry {retry + 1}/{max_retries} for second half failed: {e}"
            )
            time.sleep(2)

    if not success_first_half or not success_second_half:
        logging.error("Failed to speak one or both parts after multiple attempts.")


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
