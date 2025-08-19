'use client';

import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useCallback, MutableRefObject } from 'react';

interface TextToSpeechControlsProps {
  paragraphs: string[];
  currentParagraph: number;
  onParagraphChange: (index: number) => void;
  onJumpToParagraphRef: MutableRefObject<((index: number, paragraphs?: string[]) => void) | null>;
}

export default function TextToSpeechControls({
  paragraphs,
  currentParagraph,
  onParagraphChange,
  onJumpToParagraphRef,
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

  // Set the jumpToParagraph function in the ref so parent can use it
  useEffect(() => {
    onJumpToParagraphRef.current = jumpToParagraph;
  }, [jumpToParagraph, onJumpToParagraphRef]);

  const handlePlayPause = useCallback(() => {
    if (!speechState.isPlaying) {
      // Not playing, so start
      speak(paragraphs, currentParagraph, onParagraphChange);
    } else if (speechState.isPaused) {
      // Paused, so resume
      resume();
    } else {
      // Playing, so pause
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
      jumpToParagraph(prevIndex, paragraphs);
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(paragraphs.length - 1, currentParagraph + 1);
    onParagraphChange(nextIndex);
    if (speechState.isPlaying) {
      jumpToParagraph(nextIndex, paragraphs);
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
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between gap-6">
        {/* Left side - Title and paragraph info */}
        <div className="flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Audio Controls</h3>
          <p className="text-sm text-gray-600">
            Paragraph {currentParagraph + 1} of {paragraphs.length}
          </p>
        </div>

        {/* Center - Playback controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevious}
            disabled={currentParagraph === 0}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {speechState.isPlaying && !speechState.isPaused ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={stop}
            disabled={!speechState.isPlaying}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <Square className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentParagraph >= paragraphs.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Right side - Speed control and status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Speed</label>
            <span className="text-sm text-gray-600 min-w-[3rem]">{speechState.rate}x</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechState.rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {speechState.isPlaying && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
              <Volume2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 whitespace-nowrap">
                {speechState.isPaused ? 'Paused' : 'Playing'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Press spacebar to play/pause
        </p>
      </div>
    </div>
  );
}