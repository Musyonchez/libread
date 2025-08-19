'use client';

import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface TextToSpeechControlsProps {
  paragraphs: string[];
  currentParagraph: number;
  onParagraphChange: (index: number) => void;
}

export default function TextToSpeechControls({
  paragraphs,
  currentParagraph,
  onParagraphChange,
}: TextToSpeechControlsProps) {
  const {
    speechState,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    setRate,
    jumpToParagraph,
  } = useSpeechSynthesis();

  const handlePlayPause = useCallback(() => {
    if (!speechState.isPlaying) {
      speak(paragraphs, currentParagraph, onParagraphChange);
    } else if (speechState.isPaused) {
      resume();
    } else {
      pause();
    }
  }, [speechState.isPlaying, speechState.isPaused, speak, paragraphs, currentParagraph, onParagraphChange, resume, pause]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayPause]);

  const handlePrevious = () => {
    const prevIndex = Math.max(0, currentParagraph - 1);
    onParagraphChange(prevIndex);
    if (speechState.isPlaying) {
      jumpToParagraph(prevIndex);
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(paragraphs.length - 1, currentParagraph + 1);
    onParagraphChange(nextIndex);
    if (speechState.isPlaying) {
      jumpToParagraph(nextIndex);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <Volume2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Speech Not Supported
          </h3>
          <p className="text-gray-600">
            Your browser doesn&apos;t support text-to-speech functionality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Audio Controls</h3>
        <p className="text-sm text-gray-600">
          Paragraph {currentParagraph + 1} of {paragraphs.length}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handlePrevious}
          disabled={currentParagraph === 0}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        >
          <SkipBack className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={handlePlayPause}
          className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          {speechState.isPlaying && !speechState.isPaused ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </button>

        <button
          onClick={stop}
          disabled={!speechState.isPlaying}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentParagraph >= paragraphs.length - 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        >
          <SkipForward className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Speed</label>
          <span className="text-sm text-gray-600">{speechState.rate}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechState.rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5x</span>
          <span>1x</span>
          <span>2x</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Press spacebar to play/pause
        </p>
      </div>

      {speechState.isPlaying && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-center">
            <Volume2 className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm text-green-800">
              {speechState.isPaused ? 'Paused' : 'Playing'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}