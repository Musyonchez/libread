import sys
import json
from bs4 import BeautifulSoup
import requests
from gtts import gTTS
from io import BytesIO

def fetch_content(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        content_div = soup.find("div", class_="chapter-content")
        text_content = content_div.get_text() if content_div else "Content not found"
        return json.dumps({"text_content": text_content})
    except Exception as e:
        return json.dumps({"error": str(e)})


def generate_audio(text):
    # Convert the text to audio
    tts = gTTS(text)
    audio_io = BytesIO()
    tts.write_to_fp(audio_io)
    audio_io.seek(0)
    return audio_io

def stream_audio(text_content):
    for chunk in text_content:
        audio_io = generate_audio(chunk)
        yield audio_io.read()  # Stream the audio in chunks

if __name__ == "__main__":
    request_type = sys.stdin.read().strip()
    
    if request_type.startswith("FETCH:"):
        url = request_type.split("FETCH:")[1].strip()
        result = fetch_content(url)
        print(result)

    elif request_type.startswith("SPEAK:"):
        text_content = request_type.split("SPEAK:")[1].strip()
        audio_file = stream_audio(text_content)
        print(json.dumps({"audio_file": audio_file}))
