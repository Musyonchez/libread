
#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import pyttsx3

# Step 1: Fetch the content from the URL
url = "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-1"
response = requests.get(url)

# Step 2: Extract the text content
soup = BeautifulSoup(response.text, 'html.parser')
# Assuming the text content is within a specific HTML tag, e.g., <div class="content">
content_div = soup.find('div', class_='content')
text_content = content_div.get_text() if content_div else "Content not found"

# Step 3: Read out the content
engine = pyttsx3.init()
engine.say(text_content)
engine.runAndWait()
