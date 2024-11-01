import React, { useState } from "react";

const Play = ({
  formattedContent,
}: {
  formattedContent: JSX.Element | null;
}) => {
  const [converting, setConverting] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(null); // Track the selected line
  // Cache object to store audio URLs
  const audioCache = new Map();
  console.log("formattedContent", formattedContent);

  // Handle converting a specific line of text to audio
  const handleConvertToAudio = async (text: string, lineIndex: number) => {
    setConverting(true);
    setSelectedLine(lineIndex); // Highlight the line being read

    try {
      const response = await fetch("/api/textToSpeech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_content: text,
        }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Set the audio source and play
      const audio = new Audio(audioUrl);
      audio.playbackRate = 6; // Adjust this value for faster playback
      audio.play();
    } catch (error) {
      console.error("Error converting text to audio:", error);
    } finally {
      setConverting(false);
    }
  };

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

  const handlePlayLine = async (line: string, index: number) => {
    setSelectedLine(index); // Highlight the current line

    try {
      const audioUrl = await fetchAudio(line); // Fetch the audio URL for the line
      const audio = new Audio(audioUrl); // Create a new audio object
      audio.playbackRate = 6; // Adjust this value for faster playback
      audio.play(); // Play the current line

      // Pre-fetch next 10 lines while the current line is playing
      preFetchNextLines(index);

      // When the audio ends, play the next line
      audio.onended = () => {
        const lines = formattedContent
          ? extractTextFromFormattedContent(formattedContent)
          : [];

        // Ensure we don't go out of bounds
        if (index + 1 < lines.length) {
          handlePlayLine(lines[index + 1], index + 1); // Play the next line
        }
      };
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div>
      {/* {formattedContent ? (
        <div>{formattedContent}</div>
      ) : (
        <p>Loading content...</p>
      )} */}

      {formattedContent && (
        <div className="mt-6 w-full">
          <button
            onClick={() =>
              handleConvertToAudio(
                extractTextFromFormattedContent(formattedContent).join(""),
                -2,
              )
            } // Change this as needed
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
                  selectedLine === index ? "bg-blue-100" : "" // Highlight the selected line
                }`}
                onClick={() => handlePlayLine(line, index)}
              >
                {line}
              </p>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default Play;
