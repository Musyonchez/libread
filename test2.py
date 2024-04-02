#!/usr/bin/env python3

import pyttsx3

# Initialize the pyttsx3 engine
engine = pyttsx3.init()

# Get a list of all available voices
voices = engine.getProperty("voices")

# Print the list of voices to the console with numbers
for index, voice in enumerate(voices):
    print(f"{index}: Voice ID: {voice.id} - Voice Name: {voice.name}")

# Select a voice by its ID
# For example, to select the second voice in the list, you can use:
engine.setProperty("voice", voices[11].id)

# Adjust the pitch
engine.setProperty("pitch", 2.5) # Increase the pitch

# Now, you can use the engine to speak text with the selected voice
engine.say("Hello, World!")
engine.runAndWait()
