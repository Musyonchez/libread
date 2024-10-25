import React, { useState } from "react";

const Input = ({
  text,
  setText,
  setFetchedContent,
}: {
  text: string;
  setText: (value: string) => void;
  setFetchedContent: (value: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedElement, setSelectedElement] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedElementId, setSelectedElementId] = useState("");
  

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      alert("Failed to read clipboard contents: " + err);
    }
  };

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
          element: selectedElement || null,
          className: selectedClassName || null, 
          elementId: selectedElementId || null, 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFetchedContent(data.html_content);
        console.log(data.html_content);
      } else {
        setFetchedContent("Failed to fetch content.");
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setFetchedContent("Failed to fetch content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
      <h1 className="bg-indigo-600 text-center text-white py-4 text-xl font-medium px-3">
        Paste a web address link to get the contents of a webpage
      </h1>
      <div className="p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Please paste the url here"
          className="w-full p-4 text-lg border text-black border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition duration-200"
        />
        <div className="mt-4">
          <label className="block text-sm text-gray-700">Select Element:</label>
          <input
            type="text"
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
            placeholder="Element (e.g., div, p)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition duration-200 mt-1 text-black"
          />
          <label className="block text-sm text-gray-700 mt-2">Class Name:</label>
          <input
            type="text"
            value={selectedClassName}
            onChange={(e) => setSelectedClassName(e.target.value)}
            placeholder="Class name (optional)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition duration-200 mt-1 text-black"
          />
          <label className="block text-sm text-gray-700 mt-2">Element ID:</label>
          <input
            type="text"
            value={selectedElementId}
            onChange={(e) => setSelectedElementId(e.target.value)}
            placeholder="Element ID (optional)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition duration-200 mt-1 text-black"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="w-full mr-2 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
            onClick={handlePaste}
          >
            Paste
          </button>
          <button
            className="w-full ml-2 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Go"}
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">
          Note: We cannot fetch content from pages that require a login.
        </p>
      </div>
    </div>
  );
};

export default Input;
