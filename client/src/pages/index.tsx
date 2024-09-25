import React from 'react'

const index = () => {
  const handleFetchContent = async () => {
    const response = await fetch("/api/fetchContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: "https://www.wuxiaspot.com/novel/myriad-worlds-poison-sovereign_1.html" }),
    });

    const data = await response.json();
    console.log(data.text_content);
  };

  return (
    <div>
      <button onClick={handleFetchContent}>handleFetchContent</button>
    </div>
  )
}

export default index