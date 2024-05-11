import React, { useEffect, useState } from "react";

const Index = () => {
  const [url, setUrl] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [ifAudioUrl, setIfAudioUrl] = useState(1);

  // useEffect(() => {
  //   setIfAudioUrl(true)
  // }, [audioUrl]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Example API endpoint
    const apiUrl = "http://127.0.0.1:8000/translate/";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, chapterNumber }),
      });

      console.log(url, chapterNumber);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const audioData = await response.arrayBuffer();

      // Convert ArrayBuffer to Base64 string
      const audioBase64 = btoa(
        new Uint8Array(audioData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // Create the data URI for the audio
      const audioBlobUrl = `data:audio/mpeg;base64,${audioBase64}`;

      // Set the audio URL state to trigger rendering
      setAudioUrl(audioBlobUrl);
      setIfAudioUrl(prevIfAudioUrl => prevIfAudioUrl + 1);

      console.log("audioData", audioData)
      console.log("Audio data received successfully", audioBlobUrl);

      // const data = await response.json(); // This line reads the stream and parses it as JSON

      // console.log("Received data:", data.text_content, data);

      // Handle success
      console.log("Data sent successfully");
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="url"
          >
            URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="url"
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="chapterNumber"
          >
            Chapter Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="chapterNumber"
            type="number"
            placeholder="Enter Chapter Number"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Audio Player */}
      {ifAudioUrl >= 2  && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Audio Player
          </label>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </main>
  );
};

export default Index;
