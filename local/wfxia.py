#!/usr/bin/env python3

import logging
import time

import pyttsx3
import requests
from bs4 import BeautifulSoup
from requests.exceptions import RequestException

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def fetch_content(url):
    while True:
        try:
            # Use requests to fetch the content
            response = requests.get(url, timeout=3)  # Internal timeout for the request
            response.raise_for_status()  # Raise an exception for bad status codes (4xx, 5xx)

            # Parse the HTML content
            soup = BeautifulSoup(response.text, "html.parser")
            content_div = soup.find("div", id="article")

            # Check if the content is found and not empty
            if content_div and content_div.get_text().strip():
                return content_div.get_text()  # Return the content if found
            else:
                logging.warning("Content not found or empty, retrying...")

        except requests.RequestException as e:
            logging.error(f"Error fetching URL {url}: {e}")
        except Exception as e:
            logging.error(f"Unexpected error: {e}")

        # Wait for a short period before retrying
        time.sleep(1)


def speak_content(text_content):
    def speak_with_new_instance(content, attempt):
        """Speaks a given content with a new pyttsx3 instance."""
        local_engine = pyttsx3.init()
        local_engine.setProperty("rate", 450)
        voices = local_engine.getProperty("voices")
        local_engine.setProperty(
            "voice", voices[10].id
        )  # Change the index to select a different voice
        local_engine.setProperty("pitch", 10)  # Increase the pitch

        try:
            logging.info(f"Speaking part {attempt}...")
            local_engine.say(content)
            local_engine.runAndWait()
            logging.info(f"Part {attempt} spoken successfully.")
        except Exception as e:
            logging.error(f"Error during speech for part {attempt}: {e}")
        finally:
            local_engine.stop()

    # Splitting the text content into two halves
    mid_point = len(text_content) // 2
    first_half = text_content[:mid_point]
    second_half = text_content[mid_point:]

    max_retries = 50  # Define the max number of retries before giving up
    success_first_half, success_second_half = False, False

    # Attempt to speak the first half
    first_retries = 0
    while not success_first_half and first_retries < max_retries:
        try:
            speak_with_new_instance(first_half, 1)
            success_first_half = True
        except Exception as e:
            first_retries += 1
            logging.error(
                f"Retry {first_retries}/{max_retries} for first half failed: {e}"
            )
            time.sleep(2)  # Wait before retrying

    # Attempt to speak the second half
    second_retries = 0
    while not success_second_half and second_retries < max_retries:
        try:
            speak_with_new_instance(second_half, 2)
            success_second_half = True
        except Exception as e:
            second_retries += 1
            logging.error(
                f"Retry {second_retries}/{max_retries} for second half failed: {e}"
            )
            time.sleep(2)  # Wait before retrying

    if not success_first_half or not success_second_half:
        logging.error("Failed to speak one or both parts after multiple attempts.")


# Base URL for the chaptershttps://www.wuxiabox.com/novel/luckily-i-have-an-immortal-cultivation-simulator_1.html
# base_url = "https://www.wuxiav.com/novel/killing-evolution-from-a-sword_"
# base_url = "https://www.wuxiav.com/novel/i-the-demon-king-sign-in-the-abyss-for-a-hundred-years_"
# base_url = "https://www.wuxiaspot.com/novel/mecha-breaks-the-world_"
# base_url = "https://www.wuxiabox.com/novel/the-era-of-generals_"
# base_url = "https://www.wuxiabox.net/novel/i-have-a-bunc-of-players-on-earth_"
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
# base_url = "https://www.wuxiabox.com/novel/mortal-cultivation-who-can-be-more-yin-than-me-the-extreme-yin_"
# base_url = "https://www.wuxiabox.com/novel/mortal-seeking-immortal_"
# base_url = "https://www.wuxiabox.com/novel/my-summons-are-weird_"
# base_url = "https://www.wuxiabox.com/novel/cultivation-of-immortality-in-the-troubled-times-of-demons-and-martial-arts_"
# base_url = "https://www.wuxiaspot.com/novel/longevity-starting-from-being-a-chicken-raising-servant_"
# base_url = "https://www.wuxiaspot.com/novel/i-am-xianfan_"
# base_url = "https://www.wuxiaspot.com/novel/aiming-for-the-immortal-path_"
# base_url = "https://www.wuxiaspot.com/novel/i-have-an-alchemy-furnace_"
# base_url = "https://www.wuxiaspot.com/novel/mortal-ascension-record_"
# base_url = "https://www.wuxiaspot.com/novel/fusion-psychic-treasure-jade-and-begin-to-copy-the-heavens_"
# base_url = "https://www.wuxiaspot.com/novel/cultivation-starts-from-planting-sweet-potatoes_"
# base_url = "https://www.wuxiabox.com/novel/pursuing-longevity-with-an-immortal-mansion_"
# base_url = "https://www.wuxiabox.com/novel/i-cast-eternal-life-with-the-seeds-of-tao_"
# base_url = "https://www.wuxiabox.com/novel/immortal-fate_"
# base_url = "https://www.wuxiabox.com/novel/cultivation-i-have-an-inventory_"
# base_url = "https://www.wuxiabox.com/novel/global-sage-era_"
# base_url = "https://www.wuxiabox.com/novel/ascension-starting-from-the-chaos-art-of-heaven-and-earth_"
# base_url = "https://www.wuxiabox.com/novel/the-mortal-immortal_"
# base_url = "https://www.wuxiabox.com/novel/patriarch-of-immortal-dao-i-can-purify-all-things_"
# base_url = "https://www.wuxiabox.com/novel/immortal-cultivation-simulation-starting-from-extinguishing-the-sect_"
# base_url = "https://www.wuxiabox.com/novel/fantasy-life-simulator-ten-years-to-immortal-emperor_"
# base_url = "https://www.wuxiabox.com/novel/tianhai-xiantu_"
# base_url = "https://www.wuxiabox.com/novel/i-have-simulated-cultivating-immortals-thousands-of-times-and-i-am-invincible_"
# base_url = "https://www.wuxiabox.com/novel/gu-dao-tianzun-i-can-increase-the-success-rate-of-refining-gu_"
# base_url = "https://www.wuxiabox.com/novel/starting-from-longevity-gou-dao-becomes-immortal_"
# base_url = "https://www.wuxiabox.com/novel/6948202_" # Alchemy Dao Immortal
# base_url = "https://www.wuxiabox.com/novel/wizard-i-can-extract-identities_"
# base_url = "https://www.wuxiabox.com/novel/6948521_" Simulation of all things: starting with copper skin and iron bones
# base_url = "https://www.wuxiabox.com/novel/immortal-refiner_"
# base_url = "https://www.fanmtl.com/novel/xiuxian-the-beginning-starts-with-the-drug-boy_" #Beginning to practice immortality as a refugee
# base_url = "https://www.wuxiabox.com/novel/become-a-fairy_"
# base_url = "https://www.wuxiabox.com/novel/beastmaster-i-can-set-the-evolution-route_"
# base_url = "https://www.wuxiabox.com/novel/copying-natural-treasures-cultivating-immortality-is-not-difficult_"
# base_url = "https://www.wuxiabox.com/novel/my-beast-conquers-everything_"
# base_url = "https://www.wuxiabox.com/novel/beast-tamer-start-from-sss-talent_"
# base_url = "https://www.wuxiabox.com/novel/immortality-cultivation-i-can-use-my-clansmens-energy-and-blood-to-add-points_"
# base_url = "https://www.wuxiabox.com/novel/beast-control-starts-from-zero-points_"
# base_url = "https://www.wuxiabox.com/novel/an-ordinary-path-to-immortality_"
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
# base_url = "https://www.wuxiabox.com/novel/martial-arts-immortality-my-practice-has-experience_"
# base_url = "https://www.wuxiabox.com/novel/beast-tamer-i-can-simulate-the-eternal-beast_"
# base_url = "https://www.wuxiabox.com/novel/farming-tree-spirit_"
# base_url = "https://www.wuxiabox.com/novel/royal-beast-i-can-evolve-infinitely_"
# base_url = "https://www.wuxiabox.com/novel/beast-tamer-simulator-my-beast-can-evolve-infinitely_"
# base_url = "https://www.wuxiabox.com/novel/beast-tamer-is-invincible-others-spend-money-but-i-spend-my-life_"
# base_url = "https://www.wuxiabox.com/novel/beasts-are-just-for-me-to-bond-with_"
# base_url = "https://www.wuxiabox.com/novel/the-strongest-dragon-in-the-age-of-beasts_"
# base_url = "https://www.wuxiabox.com/novel/beast-master-for-all-i-can-see-the-hidden-evolution-route_"
# base_url = "https://www.wuxiabox.com/novel/beast-familiarization-for-all-mythical-potential-spirit-beasts-at-the-beginning_"
# base_url = "https://www.wuxiabox.com/novel/my-beast-has-unlimited-evolution_"
# base_url = "https://www.wuxiabox.com/novel/super-god-starts-from-controlling-beasts_"
# base_url = "https://www.wuxiabox.com/novel/doomsday-game-awakening-sss-level-anti-armor-at-the-beginning_"
# base_url = "https://www.wuxiabox.com/novel/in-the-world-of-xianwu-i-with-my-simulator-swept-the-world-of-tianjiao_"
# base_url = "https://www.wuxiabox.com/novel/fantasy-i-have-a-system-that-returns-the-effect-of-cultivation-ten-thousand-times_"
# base_url = "https://www.wuxiabox.com/novel/fantasy-i-who-listen-to-music-in-a-brothel-simulate-becoming-a-god_"
# base_url = "https://www.wuxiabox.com/novel/my-understanding-defies-heaven-i-create-laws-and-preach-in-the-heavens_"
# base_url = "https://www.wuxiabox.com/novel/spending-money-does-not-decrease-but-increases-i-am-invincible-with-dual-systems_"
# base_url = "https://www.wuxiabox.com/novel/can-life-span-be-exchanged-for-treasure-i-am-invincible-with-infinite-life-span_"
# base_url = "https://www.wuxiabox.com/novel/asking-about-longevity_"
# base_url = "https://www.wuxiabox.com/novel/who-told-him-to-cultivate-immortality_"
# base_url = "https://www.wuxiabox.com/novel/what-is-it-like-to-start-as-tiandao_"
# base_url = "https://www.wuxiabox.com/novel/steady-cultivation-of-immortality-the-entire-cultivation-world-is-my-home_"
# base_url = "https://www.wuxiabox.com/novel/start-with-a-blood-drinking-sword-and-destroy-the-world-of-immortal-cultivation_"
# base_url = "https://www.wuxiabox.com/novel/i-can-copy-the-three-thousand-avenues_"
# base_url = "https://www.wuxiabox.com/novel/mortal-immortal-palace_"
# base_url = "https://www.wuxiabox.com/novel/the-ancestor-of-talismans_"
# base_url = "https://www.wuxiabox.com/novel/the-immortal-spiritual-picture_"
# base_url = "https://www.wuxiabox.com/novel/a-treasure-map-every-day-i-dig-for-treasure-and-revitalize-my-family_"
# base_url = "https://www.wuxiabox.com/novel/immortal-cultivation-family-immortality-begins-from-binding-to-the-family_"
# base_url = "https://www.wuxiabox.com/novel/family-cultivation-start-with-the-fire-spirit-body-to-gain-experience_"
# base_url = "https://www.wuxiabox.com/novel/6949011_" #Starting Liver Proficiency from Alchemy
# base_url = "https://www.wuxiabox.com/novel/snake-immortal-devour-the-immortal-emperor-at-the-beginning_"
# base_url = "https://www.wuxiabox.com/novel/becoming-an-immortal-emperor-depends-entirely-on-the-efforts-of-the-enemy_"
# base_url = "https://www.wuxiabox.com/novel/steady-immortal-cultivation-my-gain-effect-is-randomly-doubled_"
# base_url = ("https://www.wuxiabox.com/novel/family-cultivation-my-comprehension-can-be-stored_")
# base_url = "https://www.wuxiabox.com/novel/practice-starts-with-skill-points_"
# base_url = "https://www.wuxiabox.com/novel/lingxu-sword-coffin-blind-swordsman_"
# base_url = "https://www.wuxiabox.com/novel/invincible-divine-sword_"
base_url = "https://freewebnovel.com/novel/beast-taming-patrol/chapter-"


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
# current_chapter = 130
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
# current_chapter = 148
# current_chapter = 98
# current_chapter = 40
# current_chapter = 314
# current_chapter = 30
# current_chapter = 55
# current_chapter = 52
# current_chapter = 141
# current_chapter = 42
# current_chapter = 56
# current_chapter = 88
# current_chapter = 587
# current_chapter = 1
# current_chapter = 22
# current_chapter = 491
# current_chapter = 20
# current_chapter = 303
# current_chapter = 150
# current_chapter = 3
# current_chapter = 86
# current_chapter = 71
# current_chapter = 9
# current_chapter = 12
# current_chapter = 103
# current_chapter = 129
# current_chapter = 27
# current_chapter = 129
# current_chapter = 66
# current_chapter = 138
# current_chapter = 1
# current_chapter = 184
# current_chapter = 252
# current_chapter = 10
# current_chapter = 346
# current_chapter = 141
# current_chapter = 83
# current_chapter = 217
# current_chapter = 251
# current_chapter = 40
# current_chapter = 2
# current_chapter = 128
# current_chapter = 182
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
# current_chapter = 10
# current_chapter = 197
# current_chapter = 8
# current_chapter = 367
# current_chapter = 84
# current_chapter = 199
# current_chapter = 2
# current_chapter = 60￼
# current_chapter = 83
# current_chapter = 109
# current_chapter = 31
# current_chapter = 1
# current_chapter = 145
# current_chapter = 149
# current_chapter = 141
# current_chapter = 118
# current_chapter = 186
# current_chapter = 330
# current_chapter = 37
# current_chapter = 115
# current_chapter = 39
# current_chapter = 49
# current_chapter = 113
# current_chapter = 85
# current_chapter = 60
# current_chapter = 152
# current_chapter = 102
# current_chapter = 223
# current_chapter = 171
# current_chapter = 544
# current_chapter = 233
# current_chapter = 110
# current_chapter = 61
# current_chapter = 211
# current_chapter = 129
# current_chapter = 150
# current_chapter = 269
# current_chapter = 34
# current_chapter = 352
current_chapter = 3


# Loop through each chapter number
for chapter_number in range(current_chapter, num_chapters + 1):
    # Construct the URL for the current chapter
    url = base_url + str(chapter_number)
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
