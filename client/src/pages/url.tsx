import React, { useState } from "react";

const Index: React.FC = () => {
  const [text, setText] = useState("");
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          url: text, // The URL from the textarea
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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-4">
      {/* Form Container */}
      <div
        className={`bg-white shadow-lg rounded-lg p-6 ${
          fetchedContent ? "max-w-md" : "max-w-lg"
        } w-full transition-all duration-300 ease-in-out`}
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Submit Your URL
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Paste your web novel URL
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white text-black"
              placeholder="Paste the URL here..."
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Fetched Content Display */}
      {fetchedContent && (
        <div className="mt-10 bg-white shadow-lg rounded-lg p-6 w-full max-h-[75vh] overflow-y-auto transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Extracted Content:
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{fetchedContent}</p>
        </div>
      )}
    </div>
  );
};

export default Index;
