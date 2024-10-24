import sys
import json
from bs4 import BeautifulSoup
import requests
from gtts import gTTS
import os

def fetch_content(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        content_div = soup.find("div", class_="chapter-content")
        text_content = content_div.get_text() if content_div else "Content not found"
        return json.dumps({"text_content": text_content})
    except Exception as e:
        return json.dumps({"error": str(e)})

def convert_text_to_audio(text_content):   
    try:
        # Define the directory and file name
        audio_dir = os.path.join(os.getcwd(), "api", "audio")
        file_name = "output_audio.mp3"
        
        # Ensure the 'api/audio' directory exists
        if not os.path.exists(audio_dir):
            os.makedirs(audio_dir)
        
        # Save the file in the 'api/audio' directory
        file_path = os.path.join(audio_dir, file_name)
        
        # Convert text to speech and save the audio file
        tts = gTTS(text=text_content, lang='en')
        tts.save(file_path)

        # Return the file path or file name
        return file_name
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    request_type = sys.stdin.read().strip()
    
    if request_type.startswith("FETCH:"):
        url = request_type.split("FETCH:")[1].strip()
        result = fetch_content(url)
        print(result)

    elif request_type.startswith("SPEAK:"):
        text_content = request_type.split("SPEAK:")[1].strip()
        audio_file = convert_text_to_audio(text_content)
        print(json.dumps({"audio_file": audio_file}))
