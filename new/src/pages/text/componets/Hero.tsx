import React, { useState } from "react";
import TextToSpeech from "../utils/TextToSpeech";

const call = () => {
  const response = TextToSpeech("hello");
  console.log(response);
};

const Hero = () => {
  const [content, setContent] = useState("");
  return (
    <div>
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
      ></textarea>
      <button onClick={() => call()}>Button here</button>
    </div>
  );
};

export default Hero;
