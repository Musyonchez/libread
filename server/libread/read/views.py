from django.http import HttpResponse
import requests
from bs4 import BeautifulSoup
import pyttsx3
import logging
from django.views.decorators.csrf import csrf_exempt
from django.views import View
import json
import io

# Configure logging
logging.basicConfig(filename="app.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class TranslateView(View):
    def fetch_content(self, url):
        print("Fetching content from URL:", url)
        response = requests.get(url)
        print("Response status code:", response.status_code)
        if response.status_code!= 200:
            print("Failed to fetch content. Status code:", response.status_code)
            return "Failed to fetch content."

        print("Parsing HTML content")
        soup = BeautifulSoup(response.text, "html.parser")
        if content_div := soup.find("div", id="article"):
            print("Extracting text from content div")
            return content_div.get_text()
        else:
            print("Content div not found. Returning 'Content not found'.")
            return "Content not found"

    def speak_content(self, text_content):
        engine = pyttsx3.init()
        engine.setProperty("rate", 200)
        voices = engine.getProperty("voices")
        engine.setProperty("voice", voices[11].id)
        engine.setProperty("pitch", 2.5)

        audio_stream = io.BytesIO()
        engine.save_to_file(text_content, audio_stream)
        engine.runAndWait()

        audio_stream.seek(0)
        audio_bytes = audio_stream.read()

        return audio_bytes

@csrf_exempt
def get(request):
    if request.method == "POST":
        data = json.loads(request.body)
        base_url = data.get("url")
        chapter_number = int(data.get("chapterNumber"))

        if not base_url or not chapter_number:
            return HttpResponse("Invalid request data.", status=400)

        translator = TranslateView()
        text_content = translator.fetch_content(base_url + str(chapter_number))
        audio_bytes = translator.speak_content(text_content)

        return HttpResponse(audio_bytes, content_type='audio/mpeg')
    else:
        return HttpResponse("Invalid request method.", status=405)
