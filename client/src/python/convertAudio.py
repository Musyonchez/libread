import sys
from gtts import gTTS
from io import BytesIO

def generate_audio(text):
    tts = gTTS(text)
    audio_io = BytesIO()
    tts.write_to_fp(audio_io)
    audio_io.seek(0)
    return audio_io.read()

def stream_audio(text_content):
    # Split text into sentences or chunks
    chunks = text_content.split('.')
    
    for chunk in chunks:
        chunk = chunk.strip()  # Remove any leading/trailing whitespace
        if chunk:  # Ensure chunk is not empty
            yield generate_audio(chunk)  # Yield audio chunks as they are generated

if __name__ == "__main__":
    request_type = sys.stdin.read().strip()

    if request_type.startswith("SPEAK:"):
        text_content = request_type.split("SPEAK:")[1].strip()

        # Stream the audio back in chunks
        for audio_chunk in stream_audio(text_content):
            sys.stdout.buffer.write(audio_chunk)  # Write binary audio data to stdout
            sys.stdout.flush()
