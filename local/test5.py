#!/usr/bin/env python3

# from email.mime import base
import logging
from io import BytesIO

import pyttsx3
import requests
from bs4 import BeautifulSoup
from gtts import gTTS, tts_exception

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
    content_div = soup.find("div", id="article")
    print("got text content")
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


def process_content(text_content):
    try:
        tts = gTTS(text=text_content, lang="en", slow=False)
        sound_file = BytesIO()
        tts.write_to_fp(sound_file)
        sound_file.seek(0)
        return sound_file
    except tts_exception.gTTSError as e:
        print(f"Failed to generate speech: {e}")
        return None

    # Now, you have two options:
    # Option 1: Send the in-memory audio data to another function
    # Option 2: Print the in-memory audio data

    # Option 1: Send the in-memory audio data to another function
    # send_to_function(sound_file)

    # Option 2: Print the in-memory audio data
    # print(sound_file.getvalue())


# Base URL for the chapters
# base_url = "https://libread.org/libread/cultivation-nerd-259375/chapter-"
# base_url = "https://libread.org/libread/my-simulated-road-to-immortality-53995/chapter-"
# base_url = "https://libread.org/libread/a-record-of-a-mortals-journey-to-immortality-novel-191779/chapter-"
# base_url = "https://freewebnovel.noveleast.com/how-the-zergs-were-made/chapter-"
# base_url = "https://freewebnovel.noveleast.com/wizards-begin-liver-experience-with-knight-breathing/chapter-"
# base_url = "https://freewebnovel.comenovel.com/warlock-of-the-magus-world/chapter-"
base_url = "https://freewebnovel.comenovel.com/humanitys-great-sage/chapter-"

# Number of chapters to fetch and speak
num_chapters = 1000  # Adjust this number based on how many chapters you want to read
# current_chapter = 52 # The current chapter number
# current_chapter = 177  # The current chapter number
# current_chapter = 23
# current_chapter = 71
# current_chapter = 326
current_chapter = 1
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
    # Read out the content
    # speak_content(text_content)
    sound_file = process_content(text_content)

    print("sound file", sound_file.read())
    # Log the completion of processing the URL
    logging.info(f"Finished processing URL: {url}")
