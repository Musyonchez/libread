#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
from gtts import gTTS
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
    content_div = soup.find("div", class_="text-left")
    return content_div.get_text() if content_div else "Content not found"


def save_content_as_mp3(text_content, filename):
    tts = gTTS(text=text_content, lang="en", slow=False)
    tts.save(f"./downloads/{filename}")
    print(f"Saved content to {filename}")


# Base URL for the chapters
base_url = (
    "https://boxnovel.com/novel/becoming-immortal-through-getting-married/chapter-"
)

# Number of chapters to fetch and speak
num_chapters = 100  # Adjust this number based on how many chapters you want to read
current_chapter = 37  # The current chapter number

# Loop through each chapter number
for chapter_number in range(current_chapter, num_chapters + 1):
    # Construct the URL for the current chapter
    url = base_url + str(chapter_number)
    # Log the URL being processed
    logging.info(f"Processing URL: {url}")
    # Fetch the content from the URL
    text_content = fetch_content(url)
    # Log the completion of processing the URL
    logging.info(f"Starting processing URL: {url}")
    # Save the content as an MP3 file
    mp3_filename = f"chapter_{chapter_number}.mp3"
    save_content_as_mp3(text_content, mp3_filename)
    # Log the completion of processing the URL
    logging.info(f"Finished processing URL: {url}")
