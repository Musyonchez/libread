import React, { useState } from "react";

const Play = ({ formattedContent }: { formattedContent: JSX.Element | null }) => {
  const [converting, setConverting] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(null); // Track the selected line

  console.log("formattedContent",formattedContent)

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
      audio.playbackRate = 3; // Adjust this value for faster playback
      audio.play();
    } catch (error) {
      console.error("Error converting text to audio:", error);
    } finally {
      setConverting(false);
    }
  };

  // Helper function to extract text from formattedContent
  const extractLines = (content: JSX.Element) => {
    // Create an array to hold the text lines
    const lines: string[] = [];

    // Function to traverse the JSX and extract text
    const traverse = (node: React.ReactNode) => {
      if (React.isValidElement(node)) {
        // If the node is a valid React element, iterate through its children
        React.Children.forEach(node.props.children, traverse);
      } else if (typeof node === 'string') {
        // If it's a string, split it into lines and add to the lines array
        lines.push(...node.split("\n").filter(line => line.trim() !== ""));
      }
    };

    // Start traversing the content
    traverse(content);

    return lines;
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
          <h2 className="text-xl font-semibold text-black mb-4">Content:</h2>
          {extractLines(formattedContent).map((line, index) => (
            <p
              key={index}
              className={`text-black mb-2 cursor-pointer ${
                selectedLine === index ? "bg-blue-100" : "" // Highlight the selected line
              }`}
              onClick={() => handleConvertToAudio(line, index)}
            >
              {line}
            </p>
          ))}
          <button
            onClick={() => handleConvertToAudio("All content", -1)} // Change this as needed
            className="py-2 px-4 bg-green-500 text-black font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
          >
            {converting ? "Converting to Audio..." : "Convert Selected Line to Audio"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Play;