import sys
import json
from bs4 import BeautifulSoup
import requests

def fetch_content(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        content_div = soup.find("div", class_="chapter-content")
        text_content = content_div.get_text() if content_div else "Content not found"
        return json.dumps({"text_content": text_content})
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    url = sys.stdin.read().strip()
    result = fetch_content(url)
    print(result)