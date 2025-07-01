#!/usr/bin/env python3

import logging
import os
import re
import shutil
import time

import pyttsx3
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

HTML_FOLDER = os.path.join("text_files", "html_files")
# CHAPTER_PREFIX = "Beast Taming_"  # Your desired prefix
CHAPTER_PREFIX = "My Beasts Are Mythica"

# Manually set the starting chapter number
start_chapter = 8


# Delete all folders inside html_files
for item in os.listdir(HTML_FOLDER):
    full_path = os.path.join(HTML_FOLDER, item)
    if os.path.isdir(full_path):
        logging.info(f"Deleting folder: {full_path}")
        shutil.rmtree(full_path)

# Gather all html files sorted by chapter number
html_files = []
chapter_pattern = re.compile(r"Chapter (\d+)")

for file in os.listdir(HTML_FOLDER):
    print(file)
    # if file.endswith(".html") and file.startswith(CHAPTER_PREFIX):
    if file.endswith(".html") and CHAPTER_PREFIX in file:
        print(file)
        match = chapter_pattern.search(file)
        if match:
            chapter_num = int(match.group(1))
            html_files.append((chapter_num, file))

# Sort by chapter number and filter from start_chapter
html_files = sorted(f for f in html_files if f[0] >= start_chapter)


def extract_text_from_html(file_path, target_chapter=None):
    """
    Extract text of a specific chapter from an HTML file where chapters are
    marked by <h3 class="chapter-title"><b>#N</b>Chapter N: Title</h3>,
    followed by a <div class="chapter-body"> for the content.

    If target_chapter is None, returns the entire content of the first chapter-body div.

    Args:
        file_path (str): Path to the HTML file.
        target_chapter (int or None): Chapter number to extract (e.g., 4).

    Returns:
        str: Extracted chapter text or empty string if not found.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "lxml")

    if target_chapter is None:
        # Fallback: extract the entire first chapter-body content
        div = soup.find("div", class_="chapter-wrap")
        if not div:
            logging.warning(f"No chapter-body div found in {file_path}")
            return ""
        paragraphs = [p.get_text(strip=True) for p in div.find_all("p")]
        return "\n".join(paragraphs)

    # Find all chapter titles and corresponding bodies
    titles = soup.find_all("h3", class_="chapter-title")
    bodies = soup.find_all("div", class_="chapter-body")

    # Defensive: lengths might differ, so use the minimum count
    count = min(len(titles), len(bodies))

    for i in range(count):
        title = titles[i]
        b_tag = title.find("b")
        if b_tag:
            # Expect b_tag text to be like "#4" (for chapter 4)
            chapter_num_str = b_tag.get_text(strip=True).lstrip("#")
            if chapter_num_str.isdigit() and int(chapter_num_str) == target_chapter:
                # Found matching chapter number
                chapter_body = bodies[i]
                paragraphs = [
                    p.get_text(strip=True) for p in chapter_body.find_all("p")
                ]
                return "\n".join(paragraphs)

    logging.warning(f"Chapter {target_chapter} not found in {file_path}")
    return ""


def speak_content(text_content):
    def speak_with_new_instance(content, attempt):
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

    quarter = len(text_content) // 4
    parts = [
        text_content[:quarter],
        text_content[quarter : quarter * 2],
        text_content[quarter * 2 : quarter * 3],
        text_content[quarter * 3 :],
    ]

    max_retries = 50
    success = [False] * 4

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


# Process each file from the chosen starting chapter
for chapter_num, filename in html_files:
    print("html_files", html_files)
    file_path = os.path.join(HTML_FOLDER, filename)
    logging.info(f"Processing Chapter {chapter_num}: {file_path}")

    # content = extract_text_from_html(file_path, chapter_num)  # for wtr-lab
    content = extract_text_from_html(file_path)  # for fictionzone

    if content:
        speak_content(content)
    else:
        logging.warning(f"No content extracted from {file_path}, skipping...")

    time.sleep(1)  # Optional delay between chapters
