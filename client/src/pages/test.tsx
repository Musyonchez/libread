import React, { useState } from "react";

const Input: React.FC = () => {
  const [text, setText] = useState("");
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/fetchContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: text,
        }),
      });

      const data = await response.json();
      setFetchedContent(data.text_content);
    } catch (error) {
      console.error("Error fetching content:", error);
      setFetchedContent("Failed to fetch content.");
    } finally {
      setLoading(false);
    }
  };
  const handleConvertToAudio = async () => {
    setConverting(true);
    if (fetchedContent) {
      try {
        const response = await fetch("/api/textToSpeech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text_content: fetchedContent,
          }),
        });

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Set the audio source and play
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error("Error converting text to audio:", error);
      } finally {
        setConverting(false);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-4">
      {/* Form to fetch content */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Submit Your URL
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your web novel URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white text-black"
              placeholder="Paste the URL here..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Fetched Content */}
      {fetchedContent && (
        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Content:</h2>
          <p className="text-white mb-4">{fetchedContent}</p>
          <button
            onClick={handleConvertToAudio}
            className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
          >
            {converting ? " Converting to Audio..." : " Convert to Audio"}
          </button>
        </div>
      )}

      {/* Audio Player */}
      {audioSrc && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Audio:</h2>
          <audio controls src={audioSrc} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default Input;
