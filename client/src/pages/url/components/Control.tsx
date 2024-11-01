import React, { useState } from "react";
import { usePlayback } from "../components/context/PlaybackContext"; // Adjust the path as necessary

// Define the props interface

// Define the Control component with props
const Control = () => {
  const { handleBackPlay, handleForwardPlay, playbackSpeed, setPlaybackSpeed } =
    usePlayback(); // Use the custom hook

  const [showPlaybackSpeedMenu, setShowPlaybackSpeedMenu] = useState(false);
  // Create an array for playback speed options from 1 to 5
  const speeds = [1, 2, 3, 4, 5];

  const handleSpeedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.preventDefault();
    const newSpeed = parseFloat(event.target.value);
    setPlaybackSpeed(newSpeed);
  };

  return (
    <div className=" w-full border-y-black border-2 relative">
      <div className="w-full justify-center flex items-center py-2 space-x-9">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-10"
            onClick={handleBackPlay}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-10"
            onClick={handleForwardPlay}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
            />
          </svg>
        </button>
        <div>
          <button
            className=" text-[26px]"
            onClick={() => setShowPlaybackSpeedMenu(!showPlaybackSpeedMenu)}
          >
            {playbackSpeed}X
          </button>
          {showPlaybackSpeedMenu && (
            <div className="absolute flex flex-col w-64 bg-white text-black rounded-md shadow-lg top-[55px] z-10 p-4">
              <div className=" flex justify-between items-center w-full">
                <h3 className="font-semibold text-lg pb-2">Playback Speed</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                  onClick={() => {
                    setShowPlaybackSpeedMenu(false);
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
              {/* Slider for playback speed */}
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={playbackSpeed}
                onChange={handleSpeedChange}
                className="slider w-full mb-4"
              />

              {/* Display current playback speed */}
              <p className="text-center text-lg font-bold mb-2">
                {playbackSpeed}x
              </p>

              {/* Speed buttons for quick selection */}
              <div className="flex justify-between">
                {speeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      setPlaybackSpeed(speed);
                      setShowPlaybackSpeedMenu(false); // Close the menu after selection
                    }}
                    className={`flex-1 mx-1 p-2 text-center rounded-md transition-colors ${
                      speed === playbackSpeed
                        ? "font-bold bg-blue-200"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Control;
