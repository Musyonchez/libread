#!/usr/bin/env python3

import argparse
import logging
import re
import sys
import time

import pyttsx3
import requests
from bs4 import BeautifulSoup


def fetch_content(url, max_retries=5):
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            content_div = soup.find("div", class_="chapter-content")
            if content_div and content_div.get_text(strip=True):
                return content_div.get_text()
            else:
                logging.warning(f"Content not found or empty at {url}. Retrying...")
        except requests.RequestException as e:
            logging.error(f"Attempt {attempt + 1} failed: Error fetching {url}: {e}")
        time.sleep(2)  # Wait before retrying
    logging.error(f"Failed to fetch content from {url} after {max_retries} attempts.")
    return None


def _speak_chunk(text, voice_index, rate, pitch, attempt):
    engine = None
    try:
        engine = pyttsx3.init()
        voices = engine.getProperty("voices")
        if 0 <= voice_index < len(voices):
            engine.setProperty("voice", voices[voice_index].id)
        engine.setProperty("rate", rate)
        engine.setProperty("pitch", pitch)
        engine.say(text)
        logging.info(f"Speaking part {attempt}...")
        engine.runAndWait()
        logging.info(f"Part {attempt} spoken successfully.")
        return True
    except Exception as e:
        logging.error(f"Error during speech for part {attempt}: {e}")
        return False
    finally:
        if engine:
            engine.stop()


def speak_content(text_content, voice_index, rate, pitch, max_retries=5, clump_size=3):
    # Split the text into sentences
    sentences = re.split(r"(?<=[.!?])\s+", text_content)

    # Group sentences into clumps
    clumps = [
        " ".join(sentences[i : i + clump_size])
        for i in range(0, len(sentences), clump_size)
    ]

    for i, clump in enumerate(clumps):
        for attempt in range(max_retries):
            if _speak_chunk(clump, voice_index, rate, pitch, i + 1):
                break
            logging.warning(
                f"Retrying to speak clump {i + 1} (attempt {attempt + 1})..."
            )
            time.sleep(1)


def main():
    parser = argparse.ArgumentParser(
        description="Web scraper and text-to-speech reader for wuxiabox.com.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument("--url", type=str, help="Base URL of the novel.")
    parser.add_argument("--start", type=int, help="Starting chapter.")
    parser.add_argument(
        "--voice-index", type=int, default=26, help="Index of the TTS voice."
    )
    parser.add_argument("--rate", type=int, default=450, help="Speech rate.")
    parser.add_argument("--pitch", type=float, default=0.5, help="Speech pitch.")
    parser.add_argument(
        "--clump-size",
        type=int,
        default=4,
        help="Number of sentences to speak at a time.",
    )

    args = parser.parse_args()

    if not args.url:
        args.url = input("Please enter the base URL of the novel: ")

    if args.start is None:
        while True:
            try:
                start_input = input("Please enter the starting chapter (default: 1): ")
                if not start_input:
                    args.start = 1
                    break
                args.start = int(start_input)
                break
            except ValueError:
                print("Invalid input. Please enter a number.")

    logging.basicConfig(
        filename="app.log",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )

    num_chapters = 1000  # Read up to 1000 chapters

    for chapter_number in range(args.start, args.start + num_chapters):
        url = f"{args.url}{chapter_number}.html"
        print(f"Processing URL: {url}")
        logging.info(f"Processing URL: {url}")

        text_content = fetch_content(url)
        if text_content:
            logging.info(f"Successfully fetched content from {url}.")
            speak_content(
                text_content,
                args.voice_index,
                args.rate,
                args.pitch,
                clump_size=args.clump_size,
            )
            logging.info(f"Finished processing {url}.")
        else:
            logging.error(f"Skipping chapter {chapter_number} due to fetch failure.")


if __name__ == "__main__":
    main()
