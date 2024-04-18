#!/usr/bin/env python3

from email.mime import base
from gtts import gTTS
import requests
from bs4 import BeautifulSoup
import pyttsx3
import logging

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

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

def save_content_as_mp3(text_content):
    # tts = gTTS(text=text_content, lang="en", slow=False)
    return gTTS(text=text_content, lang="en", slow=False)
    # tts.save(f"./downloads/{filename}")
    # print(f"Saved content to {filename}")


def main(base_url, num_chapters, current_chapter):
   # Base URL for the chapters
    # base_url = "https://libread.org/libread/cultivation-nerd-259375/chapter-"
    # base_url = "https://libread.org/libread/my-simulated-road-to-immortality-53995/chapter-"
    # base_url = "https://libread.org/libread/the-martial-unity-242653/chapter-"


    # Number of chapters to fetch and speak
    # num_chapters = 100  # Adjust this number based on how many chapters you want to read
    # current_chapter = 52 # The current chapter number
    # current_chapter = 1  # The current chapter number
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
        audiofile = save_content_as_mp3(text_content)
        # Log the completion of processing the URL
        logging.info(f"Finished processing URL: {url}")
        return audiofile

@csrf_exempt
def libread(request):
    if request.method == 'POST':
        base_url = request.POST.get('base_url')
        num_chapters = int(request.POST.get('num_chapters'))
        current_chapter = int(request.POST.get('current_chapter'))
        print(base_url, num_chapters, current_chapter)
        # Assuming main() returns the content you want to speak
        content = main(base_url, num_chapters, current_chapter)
        # return render(request, 'form.html', {'content': content})
        return render(request, 'form.html', {'content': content})
    return render(request, 'form.html')