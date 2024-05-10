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
driver.get("https://www.naturalreaders.com/")

# Find the link by its text content and click it
start_link = driver.find_element(
    By.XPATH,
    "//a[contains(@class, 'nr-btn btn-flat-primary btn-start') and contains(text(), 'start for free')]",
)
start_link.click()


# Wait for the button with the aria-label "next" to be clickable
print("Waiting for the 'Next' button to be clickable...")
wait = WebDriverWait(driver, 10)  # Wait up to 10 seconds
next_button = wait.until(
    EC.element_to_be_clickable(
        (By.XPATH, "//button[@aria-label='next to NaturalReader online content']")
    )
)

# Click the button
next_button.click()

# Find the "A.I. TEXT TO SPEECH" link and click on it
ai_text_to_speech_link = driver.find_element(
    By.XPATH,
    "//a[contains(@class, 'nr-btn') and contains(text(), 'A.I. TEXT TO SPEECH')]",
)
ai_text_to_speech_link.click()


# Wait for the SVG element to be clickable
print("Waiting for the SVG element to be clickable...")
svg_element = wait.until(
    EC.element_to_be_clickable(
        (
            By.XPATH,
            "//*[local-name()='svg' and @class='nr-icon-24']//*[local-name()='use' and @*[local-name()='href']='#nr_add_circle']",
        )
    )
)

# Click the SVG element
svg_element.click()

# Wait for the menu item to be clickable
print("Waiting for the menu item to be clickable...")
menu_item = wait.until(
    EC.element_to_be_clickable(
        (By.XPATH, "//div[@aria-label='Listen to the contents of a webpage']")
    )
)

# Click the menu item
menu_item.click()

# Directly input the URL into the input field
input_field = driver.find_element(By.ID, "webpageUrl")
input_field.send_keys(url)

# Wait for the "GO" button to be clickable and click it
go_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='url go button']"))
)
go_button.click()

intercepting_element_xpath = "//div[contains(@class, 'pw-loading')]"
WebDriverWait(driver, 10).until(
    EC.invisibility_of_element_located((By.XPATH, intercepting_element_xpath))
)


# Wait for the play button to be clickable
print("Waiting for the play button to be clickable...")
play_button = wait.until(
    EC.element_to_be_clickable(
        (
            By.XPATH,
            "//svg[@aria-label='read button pause icon [reading bar]']",
        )
    )
)

play_button.click()

# Use JavaScript to click the play button
# driver.execute_script("arguments[0].click();", play_button)

print("Finished automating Natural Reader.")
# The browser will not close automatically after this script finishes executing
