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


# List of URLs for each chapter
chapter_urls = [
    "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-1",
    "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-2",
    # Add more chapter URLs as needed
]

# Loop through each chapter URL
for url in chapter_urls:
    # Fetch the content from the URL
    text_content = fetch_content(url)
    # Read out the content
    speak_content(text_content)
