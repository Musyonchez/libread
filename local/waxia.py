#!/usr/bin/env python3

import logging
import time

import pyttsx3
import requests
from bs4 import BeautifulSoup
from requests.exceptions import RequestException

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def fetch_content(url):
    while True:
        try:
            # Use requests to fetch the content
            response = requests.get(url, timeout=3)  # Internal timeout for the request
            response.raise_for_status()  # Raise an exception for bad status codes (4xx, 5xx)

            # Parse the HTML content
            soup = BeautifulSoup(response.text, "html.parser")
            content_div = soup.find("div", class_="chapter-content")

            # Check if the content is found and not empty
            if content_div and content_div.get_text().strip():
                return content_div.get_text()  # Return the content if found
            else:
                logging.warning("Content not found or empty, retrying...")

        except requests.RequestException as e:
            logging.error(f"Error fetching URL {url}: {e}")
        except Exception as e:
            logging.error(f"Unexpected error: {e}")

        # Wait for a short period before retrying
        time.sleep(1)


def speak_content(text_content):
    def speak_with_new_instance(content, attempt):
        """Speaks a given content with a new pyttsx3 instance."""
        local_engine = pyttsx3.init()
        local_engine.setProperty("rate", 450)
        voices = local_engine.getProperty("voices")
        local_engine.setProperty(
            "voice", voices[10].id
        )  # Change the index to select a different voice
        local_engine.setProperty("pitch", 1)  # Increase the pitch

        try:
            logging.info(f"Speaking part {attempt}...")
            local_engine.say(content)
            local_engine.runAndWait()
            logging.info(f"Part {attempt} spoken successfully.")
        except Exception as e:
            logging.error(f"Error during speech for part {attempt}: {e}")
        finally:
            local_engine.stop()

    # Splitting the text content into two halves
    mid_point = len(text_content) // 2
    first_half = text_content[:mid_point]
    second_half = text_content[mid_point:]

    max_retries = 50  # Define the max number of retries before giving up
    success_first_half, success_second_half = False, False

    # Attempt to speak the first half
    first_retries = 0
    while not success_first_half and first_retries < max_retries:
        try:
            speak_with_new_instance(first_half, 1)
            success_first_half = True
        except Exception as e:
            first_retries += 1
            logging.error(
                f"Retry {first_retries}/{max_retries} for first half failed: {e}"
            )
            time.sleep(2)  # Wait before retrying

    # Attempt to speak the second half
    second_retries = 0
    while not success_second_half and second_retries < max_retries:
        try:
            speak_with_new_instance(second_half, 2)
            success_second_half = True
        except Exception as e:
            second_retries += 1
            logging.error(
                f"Retry {second_retries}/{max_retries} for second half failed: {e}"
            )
            time.sleep(2)  # Wait before retrying

    if not success_first_half or not success_second_half:
        logging.error("Failed to speak one or both parts after multiple attempts.")


base_url = "https://www.wuxiabox.com/novel/6978647_"


# Number of chapters to fetch and speak
num_chapters = 1000  # Adjust this number based on how many chapters you want to read
current_chapter = 15


# Loop through each chapter number
for chapter_number in range(current_chapter, num_chapters + 1):
    # Construct the URL for the current chapter
    url = base_url + str(chapter_number) + ".html"
    print("url", url)
    # Log the URL being processed
    logging.info(f"Processing URL: {url}")
    # Fetch the content from the URL
    text_content = fetch_content(url)
    # Log the completion of processing the URL
    logging.info(f"Starting processing URL: {url}")
    # Read out the contentchevron_left
    speak_content(text_content)
    # Log the completion of processing the URL
    logging.info(f"Finished processing URL: {url}")
