import json
import sys
from io import BytesIO

import requests
from bs4 import BeautifulSoup
from gtts import gTTS

# def fetch_content(url):
#     try:
#         response = requests.get(url)
#         soup = BeautifulSoup(response.text, "html.parser")
#         content_div = soup.find("div", class_="chapter-content")
#         text_content = content_div.get_text() if content_div else "Content not found"
#         return json.dumps({"text_content": text_content})
#     except Exception as e:
#         return json.dumps({"error": str(e)})


def fetch_content(url, element=None, class_name=None, element_id=None):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        # If element, class_name, or element_id is provided, extract matching HTML content
        if element or class_name or element_id:
            # Find the element by its tag, class, or id
            content_div = soup.find(element, {"class": class_name, "id": element_id})
            if content_div:
                # Remove all 'style' attributes
                for tag in content_div.find_all(True):
                    if tag.has_attr("style"):
                        del tag["style"]
                content_html = str(content_div)
            else:
                content_html = (
                    f"<{element} class='{class_name}' id='{element_id}'> not found"
                )
        else:
            # If no element, class, or id is provided, return the entire HTML (without CSS)
            for tag in soup.find_all(True):
                if tag.has_attr("style"):
                    del tag["style"]
            content_html = str(soup)

        return json.dumps({"html_content": content_html})

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

    # if request_type.startswith("FETCH:"):
    #     url = request_type.split("FETCH:")[1].strip()
    #     result = fetch_content(url)
    #     print(result)

    if request_type.startswith("FETCH:"):
        # Fetching the URL and optional element, class, and id
        url_parts = request_type.split("FETCH:")[1].strip().split("|")

        # Extract URL and optional parameters
        url = url_parts[0].strip()
        element = url_parts[1].strip() if len(url_parts) > 1 else None
        class_name = url_parts[2].strip() if len(url_parts) > 2 else None
        element_id = url_parts[3].strip() if len(url_parts) > 3 else None

        # Call fetch_content with all optional parameters
        result = fetch_content(url, element, class_name, element_id)
        print(result)

    elif request_type.startswith("SPEAK:"):
        text_content = request_type.split("SPEAK:")[1].strip()
        audio_file = stream_audio(text_content)
        print(json.dumps({"audio_file": audio_file}))
