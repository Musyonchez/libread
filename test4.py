#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import pyttsx3


def fetch_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    content_div = soup.find("div", id="article")
    return content_div.get_text() if content_div else "Content not found"


def speak_content(text_content):
    engine = pyttsx3.init()
    engine.setProperty("rate", 180)  # Speed of speech (words per minute)
    voices = engine.getProperty("voices")
    engine.setProperty(
        "voice", voices[11].id
    )  # Change the index to select a different voice
    engine.setProperty("pitch", 2.5)  # Increase the pitch
    engine.say(text_content)
    engine.runAndWait()


# Base URL for the chapters
base_url = "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-"

# Number of chapters to fetch and speak
num_chapters = 3  # Adjust this number based on how many chapters you want to read

# Loop through each chapter number
for chapter_number in range(2, num_chapters + 1):
    # Construct the URL for the current chapter
    url = base_url + str(chapter_number)
    # Fetch the content from the URL
    text_content = fetch_content(url)
    # Read out the content
    speak_content(text_content)
