import { useState, useEffect } from "react";

interface TextChunk {
  text: string;
  isPlaying: boolean;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [textChunks, setTextChunks] = useState<TextChunk[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(-1);

  // Function to fetch and process webpage content
  const processWebpage = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/fetch-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const { text } = await response.json();

      // Split text into chunks based on full stops (periods)
      const chunks = text
        .split(/\.(?!\d)/)
        .map((chunk: string) => chunk.trim())
        .filter((chunk: string) => chunk.length > 0)
        .map((chunk: { text: string; isPlaying: boolean }) => ({
          text: chunk + ".",
          isPlaying: false,
        }));

      setTextChunks(chunks);
    } catch (error) {
      console.error("Error processing webpage:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle text-to-speech
  const speak = (text: string, index: number) => {
    console.log("speaking", text, index);
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      setCurrentUtterance(utterance);
      setCurrentChunkIndex(index);

      // Update chunk status when speech starts/ends
      utterance.onstart = () => {
        setTextChunks((prev) =>
          prev.map((chunk, i) => ({
            ...chunk,
            isPlaying: i === index,
          })),
        );
      };

      utterance.onend = () => {
        setTextChunks((prev) =>
          prev.map((chunk) => ({
            ...chunk,
            isPlaying: false,
          })),
        );
        setCurrentChunkIndex(-1);
        setCurrentUtterance(null);

        // Automatically play next chunk
        if (index < textChunks.length - 1) {
          speak(textChunks[index + 1].text, index + 1);
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setCurrentChunkIndex(-1);
    setCurrentUtterance(null);
    setTextChunks((prev) =>
      prev.map((chunk) => ({
        ...chunk,
        isPlaying: false,
      })),
    );
  };

  const testSpeechSynthesis = () => {
    console.log("Testing SpeechSynthesis");

    // Check if the browser supports speechSynthesis
    if ("speechSynthesis" in window) {
      console.log("Browser supports SpeechSynthesis.");

      // Load voices
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices);

      if (voices.length === 0) {
        console.log(
          "No voices found initially, setting up event listener for voice changes.",
        );
        window.speechSynthesis.onvoiceschanged = () => {
          console.log("Voices changed, retrieving voices again.");
          const updatedVoices = window.speechSynthesis.getVoices();
          console.log("Voices loaded:", updatedVoices);

          // Set a default voice if available
          const utterance = new SpeechSynthesisUtterance("Hello, world!");
          if (updatedVoices.length > 0) {
            utterance.voice = updatedVoices[0];
            console.log("Selected voice:", updatedVoices[0].name);
          } else {
            console.log("No voices available, using default.");
          }

          // Set other properties for the utterance
          utterance.volume = 1; // Max volume
          utterance.rate = 1; // Normal speed
          utterance.pitch = 1; // Normal pitch

          console.log("Utterance properties set: volume 1, rate 1, pitch 1");
          console.log("Speaking utterance:", utterance.text);
          window.speechSynthesis.speak(utterance);
        };
      } else {
        // Set a default voice if voices are already available
        const utterance = new SpeechSynthesisUtterance("Hello, world!");
        utterance.voice = voices[0];
        console.log("Selected voice:", voices[0].name);

        // Set other properties for the utterance
        utterance.volume = 1; // Max volume
        utterance.rate = 1; // Normal speed
        utterance.pitch = 1; // Normal pitch

        console.log("Utterance properties set: volume 1, rate 1, pitch 1");
        console.log("Speaking utterance:", utterance.text);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.log("Speech synthesis not supported in this browser.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <button onClick={testSpeechSynthesis}>Test</button>
        <h2>Webpage Text-to-Speech Reader</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="url"
            placeholder="Enter webpage URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={processWebpage}
            disabled={isProcessing || !url}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Process
          </button>
        </div>
      </div>

      {textChunks.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              onClick={stopSpeech}
              disabled={currentChunkIndex === -1}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: currentChunkIndex !== -1 ? "pointer" : "not-allowed",
              }}
            >
              Stop
            </button>
            <button
              onClick={currentUtterance ? pauseSpeech : resumeSpeech}
              disabled={currentChunkIndex === -1}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: currentChunkIndex !== -1 ? "pointer" : "not-allowed",
              }}
            >
              {currentUtterance ? "Pause" : "Play"}
            </button>
          </div>

          {textChunks.map((chunk, index) => (
            <div
              key={index}
              onClick={() => speak(chunk.text, index)}
              style={{
                padding: "15px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: chunk.isPlaying ? "#e3f2fd" : "#fff",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              {chunk.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
