import React, { useState, useEffect, useRef } from "react";
import { usePlayback } from "./context/PlaybackContext"; // Adjust the path as necessary
import getConfig from "next/config";

const Play = ({
  formattedContent,
}: {
  formattedContent: JSX.Element | null;
}) => {
  const { currentLineIndex, setCurrentLineIndex, playbackSpeed } =
    usePlayback(); // Use the custom hook
  const audioRef = useRef<HTMLAudioElement | null>(null); // Store the current audio instance

  const [converting, setConverting] = useState(false);
  // Cache object to store audio URLs
  const audioCache = new Map();
  console.log("formattedContent", formattedContent);

  // Helper function to extract text from formattedContent
  const extractTextFromFormattedContent = (content: JSX.Element) => {
    // Create an array to hold the text lines
    const lines: string[] = [];

    // Function to traverse the JSX and extract text
    const traverse = (node: React.ReactNode) => {
      if (React.isValidElement(node)) {
        // If the node is a valid React element, iterate through its children
        React.Children.forEach(node.props.children, traverse);
      } else if (typeof node === "string") {
        // If it's a string, split it into lines and add to the lines array
        lines.push(...node.split("\n").filter((line) => line.trim() !== ""));
      }
    };

    // Start traversing the content
    traverse(content);

    return lines;
  };

  // Fetch audio for a specific line
  const fetchAudio = async (lineText: string) => {
    if (audioCache.has(lineText)) {
      return audioCache.get(lineText); // Return cached audio URL
    }

    const response = await fetch("/api/textToSpeech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_content: lineText }),
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Cache the audio URL
    audioCache.set(lineText, audioUrl);
    console.log("Cached lines:", Array.from(audioCache.keys())); // Logs all the lines (keys) in the cache
    return audioUrl;
  };

  // Pre-fetch the next 10 lines of audio
  const preFetchNextLines = async (startIndex: number) => {
    const lines = formattedContent
      ? extractTextFromFormattedContent(formattedContent)
      : [];

    for (
      let i = startIndex + 1;
      i <= startIndex + 10 && i < lines.length;
      i++
    ) {
      const line = lines[i];
      if (!audioCache.has(line)) {
        await fetchAudio(line);
      }
    }
  };

  // Helper function to play audio
  const playAudio = (audioUrl: string, index: number) => {
    console.log("index at playAudio", index)
    console.log("currentLineIndex at playAudio", currentLineIndex)

    // Stop the currently playing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create a new audio instance
    const audio = new Audio(audioUrl);
    audioRef.current = audio; // Store it in the ref
    audio.playbackRate = playbackSpeed; // Adjust playback speed
    audio.play(); // Play the audio

        // Pre-fetch next 10 lines while the current line is playing
        preFetchNextLines(index);

    // When the audio ends, play the next line
    audio.onended = () => {
      const lines = formattedContent
        ? extractTextFromFormattedContent(formattedContent)
        : [];
        
      const nextIndex = index + 1;

      if (nextIndex < lines.length) {
        console.log("index at nextIndex", nextIndex)
        console.log("currentLineIndex at nextIndex", currentLineIndex)
        setCurrentLineIndex(nextIndex); // Move to the next line
        handlePlayLine(lines[nextIndex], nextIndex); // Play the next line
      }
    };
  };

  // Handle line playback
  const handlePlayLine = async (line: string, index: number) => {
    console.log("index at handlePlayLine", index)
    console.log("currentLineIndex at handlePlayLine", currentLineIndex)
    setCurrentLineIndex(index);

    try {
      const audioUrl = await fetchAudio(line); // Fetch the audio URL for the line
      playAudio(audioUrl, index); // Play the fetched audio
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Effect to update the audio playback speed dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      // audioRef.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]); // Update playback speed when it changes

// v
// static getDerivedStateFromProps(props, state) {gdf
//   getConfigf
//   s
//   fwe
//   fs
//   f
//   WritableStreamDefaultWriter
//   webkitURLw
//   falsefw

// }

//   Have currentLineIndex and selected lines be two difrent states so that you can use useEffect with ou affecting the other

  // useEffect(() => {

  //   setCurrentLineIndex(prev => currentLineIndex)
  // }, [currentLineIndex]); // Use handlePlayLine as a dependency
  

  return (
    <div>
      <div> {currentLineIndex}</div>

      {formattedContent && (
        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold text-black mb-4">Content:</h2>
          {extractTextFromFormattedContent(formattedContent).map(
            (line, index) => (
              <p
                key={index}
                className={`text-black mb-2 cursor-pointer ${
                  currentLineIndex === index ? "bg-blue-100" : "" // Highlight the selected line
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
