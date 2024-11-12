import { useState, useEffect } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      // Get voices and filter out empty ones
      const availableVoices = synth.getVoices().filter((voice) => voice.name);

      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Prefer an English voice if available, otherwise use the first voice
        const englishVoice = availableVoices.find((voice) =>
          voice.lang.includes("en-"),
        );
        setSelectedVoice(englishVoice || availableVoices[0]);
      }
    };

    loadVoices();

    // Chrome loads voices asynchronously
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Cancel any ongoing speech when component unmounts
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    // Cancel ongoing speech
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    if (text && selectedVoice) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice properties
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Event handlers
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = (err) => {
          console.error("Speech synthesis error:", err);
          setSpeaking(false);
          // Retry once if synthesis fails
          if (err.error === "synthesis-failed") {
            setTimeout(() => {
              synth.cancel();
              synth.speak(utterance);
            }, 50);
          }
        };

        setSpeaking(true);
        synth.speak(utterance);
      } catch (error) {
        console.error("Failed to initialize speech:", error);
        setSpeaking(false);
      }
    }
  };

  if (!supported) {
    return (
      <div className="p-4 text-red-500">
        Speech synthesis is not supported in your browser.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-4 h-32"
        placeholder="Enter text to speak..."
      />

      <div className="mb-4">
        <select
          value={selectedVoice?.name || ""}
          onChange={(e) => {
            const voice = voices.find((v) => v.name === e.target.value);
            setSelectedVoice(voice);
          }}
          className="w-full p-2 border rounded"
          disabled={!voices.length}
        >
          {voices.length === 0 && <option value="">Loading voices...</option>}
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={speak}
        disabled={!selectedVoice || !text.trim()}
        className={`w-full p-2 rounded transition-colors ${
          !selectedVoice || !text.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {speaking ? "Stop" : "Speak"}
      </button>
    </div>
  );
};

export default TextToSpeech;
