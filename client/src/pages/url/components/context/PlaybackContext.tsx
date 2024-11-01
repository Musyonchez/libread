// src/context/PlaybackContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface PlaybackContextType {
  currentLineIndex: number;
  setCurrentLineIndex: (value: number) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (value: number) => void;
  handleBackPlay: () => void;
  handleForwardPlay: () => void;
}

// Create the context with a default value
const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined
);

const PlaybackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3.0);

  const handleBackPlay = () => {
    setCurrentLineIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleForwardPlay = () => {
    setCurrentLineIndex((prev) => prev + 1);
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentLineIndex,
        setCurrentLineIndex,
        handleBackPlay,
        handleForwardPlay,
        playbackSpeed,
        setPlaybackSpeed,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

// Create a custom hook to use the PlaybackContext
const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
};

export { PlaybackProvider, usePlayback };
