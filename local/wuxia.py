#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import pyttsx3
import logging

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def fetch_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    # content_div = soup.find("div", class_="text-left")
    content_div = soup.find("div", class_="chapter-content")
    return content_div.get_text() if content_div else "Content not found"


def speak_content(text_content):
    engine = pyttsx3.init()
    engine.setProperty("rate", 200)  # Speed of speech (words per minute)
    voices = engine.getProperty("voices")
    engine.setProperty(
        "voice", voices[11].id
    )  # Change the index to select a different voice
    engine.setProperty("pitch", 2.5)  # Increase the pitch
    engine.say(text_content)
    engine.runAndWait()


# Base URL for the chapters
# base_url = "https://www.wuxiav.com/novel/killing-evolution-from-a-sword_"
# base_url = "https://www.wuxiav.com/novel/i-the-demon-king-sign-in-the-abyss-for-a-hundred-years_"
# base_url = "https://www.wuxiav.com/novel/otherworldly-merchant_"
# base_url = "https://www.wuxiabox.com/novel/the-era-of-generals_"
# base_url = "https://www.wuxiabox.net/novel/i-have-a-bunch-of-players-on-earth_"
# base_url = "https://www.wuxiabox.net/novel/a-sorcerers-journey_"
# base_url = "https://www.wuxiabox.net/novel/the-oracle-paths_"
base_url = "https://www.wuxiabox.com/novel/national-beast-awakening-mythical-talent-at-the-start_"


# Number of chapters to fetch and speak
num_chapters = 1000  # Adjust this number based on how many chapters you want to read
# current_chapter = 45
# current_chapter = 2
# current_chapter = 1
# current_chapter = 11
# current_chapter = 21
# current_chapter = 510
# current_chapter = 243
current_chapter = 114


# Loop through each chapter number
for chapter_number in range(current_chapter, num_chapters + 1):
    # Construct the URL for the current chapter
    url = base_url + str(chapter_number) + ".html"
    # Log the URL being processed
    logging.info(f"Processing URL: {url}")
    # Fetch the content from the URL
    text_content = fetch_content(url)
    # Log the completion of processing the URL
    logging.info(f"Starting processing URL: {url}")
    # Read out the content
    speak_content(text_content)

    # Log the completion of processing the URL
    logging.info(f"Finished processing URL: {url}")
