#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import pyttsx3

# Step 1: Fetch the content from the URL
url = "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-1"
response = requests.get(url)

# Step 2: Extract the text content
soup = BeautifulSoup(response.text, "html.parser")
# Find the div with id="article"
content_div = soup.find("div", id="article")
text_content = content_div.get_text() if content_div else "Content not found"

# Step 3: Read out the content
engine = pyttsx3.init()
# Change the speech rate
engine.setProperty("rate", 180)
# Speed of speech (words per minute)

# Change the voice
voices = engine.getProperty("voices")
engine.setProperty("voice", voices[11].id)

# Adjust the pitch
engine.setProperty("pitch", 2.5) # Increase the pitch

# Change the index to select a different voice
engine.say(text_content)
engine.runAndWait()
