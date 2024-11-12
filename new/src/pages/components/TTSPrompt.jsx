// components/TTSPrompt.jsx
"use client";

import { useState } from "react";

export default function TTSPrompt({ text }) {
  const [speech] = useState(null);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <button onClick={speak}>Speak</button>
      {speech && <p>Speaking...</p>}
    </div>
  );
}
