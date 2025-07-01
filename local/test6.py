from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

url = "https://fictionzone.net/novel/abandoned-by-gods-and-immortals-i-created-countless-immortal-emperor-techniques/chapter-one-longhu-mountain-heavenly-master-are-there-real-immortals-and-buddhas-in-the-world"

driver.get(url)
time.sleep(3)  # Let the page load (adjust if needed)

soup = BeautifulSoup(driver.page_source, "html.parser")

title = soup.find("h1").text.strip() if soup.find("h1") else "No title found"
content_div = soup.find("div", class_="chapter-content")

if content_div:
    content = content_div.get_text(separator="\n", strip=True)
else:
    content = "Chapter content not found."

driver.quit()

print(f"Title: {title}\n")
print(content)
