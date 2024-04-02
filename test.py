#!/usr/bin/env python3
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as BraveService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType
import time

def automate_natural_reader(novel_link):
    # Path to Brave executable
    brave_path = "/opt/brave.com/brave/brave" # Update this path to where Brave is installed

    # Path to Brave profile
    brave_profile_path = "/home/yourusername/.config/BraveSoftware/Brave-Browser/Default" # Update this path to your Brave profile path

    options = webdriver.ChromeOptions()
    options.binary_location = brave_path
    options.add_argument(f"--user-data-dir={brave_profile_path}")

    # Create a new service with the path to ChromeDriver
    service = BraveService(ChromeDriverManager(chrome_type=ChromeType.BRAVE).install())

    # Initialize the WebDriver with the service and options
    driver = webdriver.Chrome(service=service, options=options)

    # Navigate to Natural Reader
    driver.get("https://www.naturalreaders.com/online/")
    
    # Wait for the page to load
    time.sleep(5)
    
    # Find the "Add Webpage" input field and paste the novel link
    add_webpage_input = driver.find_element_by_id("addWebpage")
    add_webpage_input.send_keys(novel_link)

    # Find the "Add Webpage" button and click it
    add_webpage_button = driver.find_element_by_id("addWebpageButtonId") # Replace "addWebpageButtonId" with the actual ID of the button
    add_webpage_button.click()

    # Wait for the page to load the content
    time.sleep(10)
    
    # Run the reader (assuming there's a button to start reading)
    # This part might need adjustment based on the actual UI of Natural Reader
    # For example, if there's a button with id "startReading", you can use:
    # start_reading_button = driver.find_element_by_id("startReading")
    # start_reading_button.click()
    
    # Keep the browser open for manual inspection
    # driver.quit()

# Example usage
novel_link = "https://libread.org/libread/immortality-my-cultivation-has-no-bottleneck-64015/chapter-1"
print("Starting automate_natural_reader...")
automate_natural_reader(novel_link)
print("Finished automate_natural_reader.")
