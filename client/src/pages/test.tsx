import React, { useState, useEffect, useRef } from "react";
import { usePlayback } from "./context/PlaybackContext"; // Adjust the path as necessary

const Play = ({
  formattedContent,
}: {
  formattedContent: JSX.Element | null;
}) => {
  const { currentLineIndex, setCurrentLineIndex, playbackSpeed } = usePlayback();
  const [converting, setConverting] = useState(false);
  const audioCache = useRef(new Map()); // Cache object to store audio URLs
  const audioRef = useRef<HTMLAudioElement | null>(null); // Store the current audio instance

  // Handle converting a specific line of text to audio
  const handleConvertToAudio = async (text: string, lineIndex: number) => {
    setConverting(true);
    setCurrentLineIndex(lineIndex); // Highlight the line being read

    try {
      const response = await fetch("/api/textToSpeech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text_content: text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      playAudio(audioUrl); // Play the audio
    } catch (error) {
      console.error("Error converting text to audio:", error);
    } finally {
      setConverting(false);
    }
  };

  // Helper function to play audio
  const playAudio = (audioUrl: string) => {
    // Stop the currently playing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create a new audio instance
    const audio = new Audio(audioUrl);
    audioRef.current = audio; // Store it in the ref
    audio.playbackRate = playbackSpeed; // Adjust playback speed
    audio.play(); // Play the audio

    // When the audio ends, play the next line
    audio.onended = () => {
      const lines = formattedContent
        ? extractTextFromFormattedContent(formattedContent)
        : [];
      const nextIndex = currentLineIndex + 1;

      if (nextIndex < lines.length) {
        setCurrentLineIndex(nextIndex); // Move to the next line
        handlePlayLine(lines[nextIndex], nextIndex); // Play the next line
      }
    };
  };

  // Handle line playback
  const handlePlayLine = async (line: string, index: number) => {
    setCurrentLineIndex(index);

    try {
      const audioUrl = await fetchAudio(line); // Fetch the audio URL for the line
      playAudio(audioUrl); // Play the fetched audio
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Fetch audio for a specific line
  const fetchAudio = async (lineText: string) => {
    if (audioCache.current.has(lineText)) {
      return audioCache.current.get(lineText); // Return cached audio URL
    }

    const response = await fetch("/api/textToSpeech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_content: lineText }),
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    audioCache.current.set(lineText, audioUrl); // Cache the audio URL

    return audioUrl;
  };

  // Extract text from JSX content
  const extractTextFromFormattedContent = (content: JSX.Element) => {
    const lines: string[] = [];
    const traverse = (node: React.ReactNode) => {
      if (React.isValidElement(node)) {
        React.Children.forEach(node.props.children, traverse);
      } else if (typeof node === "string") {
        lines.push(...node.split("\n").filter((line) => line.trim() !== ""));
      }
    };
    traverse(content);
    return lines;
  };

  // Effect to update the audio playback speed dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]); // Update playback speed when it changes

  return (
    <div>
      <div>{currentLineIndex}</div>
      {formattedContent && (
        <div className="mt-6 w-full">
          <button
            onClick={() =>
              handleConvertToAudio(
                extractTextFromFormattedContent(formattedContent).join(""),
                currentLineIndex
              )
            }
            className="py-3 px-4 bg-green-500 text-black font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
          >
            {converting
              ? "Converting to Audio..."
              : "Convert Selected Line to Audio"}
          </button>
          <h2 className="text-xl font-semibold text-black mb-4">Content:</h2>
          {extractTextFromFormattedContent(formattedContent).map(
            (line, index) => (
              <p
                key={index}
                className={`text-black mb-2 cursor-pointer ${
                  currentLineIndex === index ? "bg-blue-100" : ""
                }`}
                onClick={() => handlePlayLine(line, index)}
              >
                {line}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Play;
