#!/usr/bin/env python3

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

url = "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-1"

# Initialize Chrome options and add the detach option
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)

# Initialize the WebDriver with the detach option
driver = webdriver.Chrome(options=chrome_options)

# Navigate to the Natural Readers website
print("Navigating to the Natural Readers website...")
driver.get("https://ttsreader.com/player/")

# Directly input the URL into the input field
text_box = driver.find_element(By.CLASS_NAME, "Text-box")
text_box.send_keys(url)

print("URL inserted into the text box.")

play_button = WebDriverWait(driver, 20).until(
    EC.element_to_be_clickable((By.ID, "Play-btn"))
)
play_button.click()

play_button = WebDriverWait(driver, 20).until(
    EC.element_to_be_clickable(
        (By.XPATH, "//button[@data-hook-ref='togglePlayButton']")
    )
)
play_button.click()

# Use JavaScript to click the play button
# driver.execute_script("arguments[0].click();", play_button)

print("Finished automating ttsreader.")
# The browser will not close automatically after this script finishes executing
