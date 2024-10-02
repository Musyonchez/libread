#!/usr/bin/env python3

import logging

import pyttsx3
import requests
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def fetch_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    # content_div = soup.find("div", class_="text-left")
    content_div = soup.find("div", class_="chapter-content")
    return content_div.get_text() if content_div else "Content not found"




def speak_content(text_content):
    # print("text_content", text_content)
    engine = pyttsx3.init()
    engine.setProperty("rate", 450)  # Speed of speech (words per minute)
    voices = engine.getProperty("voices")
    engine.setProperty(
        "voice", voices[11].id
    )  # Change the index to select a different voice
    engine.setProperty("pitch", 2.5)  # Increase the pitch
    engine.say(text_content)
    engine.runAndWait()


# Base URL for the chapters
# base_url = "https://www.wuxiav.com/novel/killing-evolution-from-a-sword_"
# base_url = "https://www.wuxiav.com/novel/i-the-demon-king-sign-in-the-abyss-for-a-hundred-years_"
# base_url = "https://www.wuxiaspot.com/novel/mecha-breaks-the-world_"
# base_url = "https://www.wuxiabox.com/novel/the-era-of-generals_"
# base_url = "https://www.wuxiabox.net/novel/i-have-a-bunch-of-players-on-earth_"
# base_url = "https://www.wuxiabox.net/novel/a-sorcerers-journey_"
# base_url = "https://www.wuxiabox.net/novel/the-oracle-paths_"
# base_url = "https://www.wuxiabox.com/novel/national-beast-awakening-mythical-talent-at-the-start_"
# base_url = "https://www.wuxiabox.com/novel/the-weakest-summon-the-devils-contract-talent-is-maxed-out-at-the-beginning_"
# base_url = "https://www.wuxiabox.com/novel/invincible-slaughter-system_"
# base_url = "https://www.wuxiabox.com/novel/seeking-immortality-in-a-deceitful-way-starts-by-making-oneself-into-a-puppet_"
# base_url = "https://www.wuxiabox.com/novel/the-strongest-dragon-in-the-age-of-beasts_"
# base_url = "https://www.wuxiabox.com/novel/diary-of-the-death-wizard_"
# base_url = "https://www.wuxiabox.com/novel/6952281_"
# base_url = "https://www.wuxiabox.com/novel/puppet-cultivation-if-you-find-the-real-one-i-lose_"
# base_url = "https://www.wuxiabox.com/novel/the-wizards-road-begins-with-the-simulator_"
# base_url = "https://www.wuxiabox.com/novel/national-star-sea-era_"
# base_url = "https://www.wuxiabox.com/novel/the-wizards-road-begins-with-the-simulator_"
# base_url = "https://www.wuxiabox.com/novel/wizard-world-journey_"
# base_url = "https://www.wuxiabox.com/novel/wizard-i-can-extract-everything_"
# base_url = "https://www.wuxiabox.com/novel/constructing-style-wizard_"
# base_url = "https://www.wuxiabox.com/novel/six-ring-wizard_"
# base_url = "https://www.wuxiabox.com/novel/the-wizarding-age_"
# base_url = "https://www.fanmtl.com/novel/the-wizards-immortality-wizarding-immortal_"
# base_url  = "https://www.wuxiabox.com/novel/extracting-billions-of-toxins-and-tempering-an-unsullied-body_"
# base_url = "https://www.wuxiabox.com/novel/6944348_"
# base_url = "https://www.wuxiabox.com/novel/6944348_"
# base_url = "https://www.wuxiabox.com/novel/wizards-chasing-the-truth_"
# base_url = "https://www.wuxiabox.com/novel/the-wizards-order_"
# base_url = "https://www.wuxiabox.com/novel/6951084_"
# base_url = "https://www.wuxiabox.com/novel/immortal-palace-longevity_"
# base_url = "https://www.wuxiabox.com/novel/6947206_"
# base_url = "https://www.wuxiabox.com/novel/i-started-my-cultivation-by-picking-up-the-immortal-skills_"
# base_url = "https://www.wuxiabox.com/novel/my-longevity-simulation_"
# base_url = "https://www.wuxiabox.com/novel/farming-in-the-immortal-mansion_"
# base_url = "https://www.wuxiabox.com/novel/infinite-battle_"
# base_url = "https://www.wuxiabox.com/novel/i-can-track-everything_"
# base_url = "https://www.wuxiabox.com/novel/mortal-cultivation-portable-space_"
# base_url = "https://www.wuxiabox.com/novel/longevity-start-with-infinite-blue-bar_" # Refine Gu to become immortal from one person
# base_url = "https://www.wuxiabox.com/novel/mortal-immortal-palace_"
# base_url = "https://www.wuxiabox.com/novel/mortal-blood_"
# base_url = "https://www.wuxiabox.com/novel/cultivation-of-immortality-in-the-troubled-times-of-demons-and-martial-arts_"
# base_url = "https://www.wuxiabox.com/novel/mortal-seeking-immortal_"
# base_url = "https://www.wuxiabox.com/novel/farming-in-the-immortal-mansion_"
# base_url = "https://www.wuxiabox.com/novel/qingyuan-immortal-palace_"
# base_url = "https://www.wuxiabox.com/novel/my-martial-arts-will-hang-up_"
# base_url = "https://www.wuxiabox.com/novel/cultivating-immortals-is-a-hard-job_"
# base_url = "https://www.wuxiabox.com/novel/immortal-cultivation-simulator-starts-with-low-martial-arts_"
# base_url = "https://www.wuxiabox.com/novel/longevity-species_"
# base_url = "https://www.wuxiabox.com/novel/longevity-martial-arts-i-have-a-black-water-snake-clone_"
# base_url = "https://www.wuxiabox.com/novel/my-immortal-cultivation-simulation_" # Longevity starts with learning
# base_url = "https://www.wuxiaspot.com/novel/my-talent-for-cultivating-immortals-can-be-refreshed_"
# base_url = "https://www.wuxiaspot.com/novel/mortals-cultivating-immortality-and-the-fate-of-immortal-jade_"
# base_url = "https://www.wuxiaspot.com/novel/cultivation-begins-with-the-mysterious-little-tripod_"
# base_url = "https://www.wuxiaspot.com/novel/demon-sect-cultivation-i-can-disable-debuffs_"
# base_url = "https://www.wuxiabox.com/novel/become-a-fairy_"
# base_url = "https://www.wuxiabox.com/novel/living-in-the-world-of-cultivation_"
# base_url = "https://www.wuxiabox.com/novel/copying-natural-treasures-cultivating-immortality-is-not-difficult_"
# base_url = "https://www.wuxiabox.com/novel/immortal-cultivation-simulation-the-great-great-grandson-bring-back-cultivation-technique_"
base_url = "https://www.wuxiabox.com/novel/martial-arts-immortality-my-practice-has-experience_"





# Number of chapters to fetch and speak
num_chapters = 1000  # Adjust this number based on how many chapters you want to read
# current_chapter = 58
# current_chapter = 2
# current_chapter = 1
# current_chapter = 11
# current_chapter = 21
# current_chapter = 510
# current_chapter = 243
# current_chapter = 114
# current_chapter = 106
# current_chapter = 3
# current_chapter = 3
# current_chapter = 19
# current_chapter = 28
# current_chapter = 13
# current_chapter = 2
# current_chapter = 8
# current_chapter = 1
# current_chapter = 116
# current_chapter = 37
# current_chapter = 162
# current_chapter = 10
# current_chapter = 90
# current_chapter = 40
# current_chapter = 1
# current_chapter = 1
# current_chapter = 1
# current_chapter = 123
# current_chapter = 13
# current_chapter = 123
# current_chapter = 105
# current_chapter = 314
# current_chapter = 5
# current_chapter = 6
# current_chapter = 45
# current_chapter = 1
# current_chapter = 1
# current_chapter = 6
# current_chapter = 189
# current_chapter = 118
# current_chapter = 96
# current_chapter = 40
# current_chapter = 28
# current_chapter = 1
# current_chapter = 77
# current_chapter = 94
# current_chapter = 63
# current_chapter = 324
# current_chapter = 198
# current_chapter = 107
# current_chapter = 124
# current_chapter = 61
# current_chapter = 106
# current_chapter = 95
# current_chapter = 45
# current_chapter = 29
# current_chapter = 1
# current_chapter = 409
# current_chapter = 43
# current_chapter = 83
# current_chapter = 43
current_chapter = 9













# Loop through each chapter number
for chapter_number in range(current_chapter, num_chapters + 1):
    # Construct the URL for the current chapter
    url = base_url + str(chapter_number) + ".html"
    print("url", url)
    # Log the URL being processed
    logging.info(f"Processing URL: {url}")
    # Fetch the content from the URL
    text_content = fetch_content(url)
    # Log the completion of processing the URL
    logging.info(f"Starting processing URL: {url}")
    # Read out the content
    speak_content(text_content)
    # Log the completion of processing the URL
    logging.info(f"Finished processing URL: {url}")
