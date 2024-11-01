import React, { useState, useEffect, useRef } from "react";

const NovelPlayer = () => {
  const [chapterNumber, setChapterNumber] = useState(1); // Start at chapter 1
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Store the audio URL
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  const [loading, setLoading] = useState(false); // Track if loading content/audio
  const audioRef = useRef<HTMLAudioElement | null>(null); // Store the audio instance

  const baseUrl = "https://www.wuxiabox.com/novel/godly-choice-system_"; // Base URL of the novel

  // Function to fetch the content of the current chapter
  const fetchContent = async (chapter: number) => {
    try {
      setLoading(true);
      const response = await fetch("/api/fetchContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `${baseUrl}${chapter}.html` }),
      });

      const data = await response.json();
      return data.textContent; // Assuming the API returns a JSON object with `textContent`
    } catch (error) {
      console.error("Error fetching content:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to convert the fetched text to speech
  const convertTextToSpeech = async (text: string) => {
    try {
      const response = await fetch("/api/textToSpeech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text_content: text }),
      });

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob); // Create a URL for the audio
    } catch (error) {
      console.error("Error converting text to speech:", error);
      return null;
    }
  };

  // Function to play the fetched audio
  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop the currently playing audio
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);

    // When the audio ends, fetch the next chapter
    audio.onended = () => {
      setIsPlaying(false);
      incrementChapter(); // Move to the next chapter
    };
  };

  // Function to increment the chapter number and repeat the process
  const incrementChapter = () => {
    setChapterNumber((prevChapter) => prevChapter + 1);
  };

  // Effect to fetch content, convert to speech, and play the audio when the chapter changes
  useEffect(() => {
    const loadChapter = async () => {
      const textContent = await fetchContent(chapterNumber); // Fetch the text content
      if (textContent) {
        const audio = await convertTextToSpeech(textContent); // Convert the text to speech
        if (audio) {
          setAudioUrl(audio); // Set the audio URL to state
          playAudio(audio); // Play the audio
        }
      }
    };

    if (!isPlaying && !loading) {
      loadChapter(); // Load the chapter only if not playing audio or already loading
    }
  }, [chapterNumber]);

  return (
    <div>
      <h1>Novel Player</h1>
      <p>Currently playing: Chapter {chapterNumber}</p>
      {loading && <p>Loading content...</p>}
      {audioUrl && <p>Playing audio...</p>}
      <button onClick={incrementChapter} disabled={loading || isPlaying}>
        Skip to Next Chapter
      </button>
    </div>
  );
};

export default NovelPlayer;
