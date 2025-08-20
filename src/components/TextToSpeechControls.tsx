'use client';

import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useCallback, MutableRefObject, useState } from 'react';

interface TextToSpeechControlsProps {
  paragraphs: string[];
  currentParagraph: number;
  onParagraphChange: (index: number) => void;
  onJumpToParagraphRef: MutableRefObject<((index: number, paragraphs?: string[], onParagraphChange?: (index: number) => void) => void) | null>;
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

  // Mobile controls toggle state
  const [isExpanded, setIsExpanded] = useState(false);

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
      resume(onParagraphChange);
    } else {
      // Playing, so pause
      pause();
    }
  }, [speechState.isPlaying, speechState.isPaused, speak, paragraphs, currentParagraph, onParagraphChange, resume, pause]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle spacebar if not typing in an input field
      if (event.code === 'Space' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true'
        );
        
        if (!isTyping) {
          event.preventDefault();
          handlePlayPause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayPause]);

  const handlePrevious = () => {
    if (currentParagraph <= 0) return; // Don't go back if already at first paragraph
    const prevIndex = currentParagraph - 1;
    onParagraphChange(prevIndex); // Update visual indicator immediately
    setTimeout(() => jumpToParagraph(prevIndex, paragraphs, onParagraphChange), 20); // Start speech after state update
  };

  const handleNext = () => {
    if (currentParagraph >= paragraphs.length - 1) return; // Don't go forward if already at last paragraph
    const nextIndex = currentParagraph + 1;
    onParagraphChange(nextIndex); // Update visual indicator immediately
    setTimeout(() => jumpToParagraph(nextIndex, paragraphs, onParagraphChange), 20); // Start speech after state update
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
      {/* Mobile: Compact/Expandable layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Always visible: Playback controls with toggle */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handlePrevious}
            disabled={speechState.currentParagraph === 0}
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
            onClick={() => stop(onParagraphChange)}
            disabled={!speechState.isPlaying}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <Square className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            disabled={speechState.currentParagraph >= paragraphs.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="h-4 w-4 text-gray-700" />
          </button>

          {/* Toggle button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-700" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-700" />
            )}
          </button>
        </div>

        {/* Expandable content */}
        {isExpanded && (
          <>
            {/* Title and paragraph info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Audio Controls</h3>
              <p className="text-sm text-gray-600">
                Paragraph {currentParagraph + 1} of {paragraphs.length}
              </p>
            </div>

            {/* Speed controls */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Speed</label>
              
              {/* Preset speed buttons */}
              <div className="flex gap-1">
                {[0.5, 1, 1.5, 2].map((presetRate) => (
                  <button
                    key={presetRate}
                    onClick={() => setRate(presetRate, onParagraphChange)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      Math.abs(speechState.rate - presetRate) < 0.05
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {presetRate}x
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 min-w-[2.5rem]">{speechState.rate}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechState.rate}
                  onChange={(e) => setRate(parseFloat(e.target.value), onParagraphChange)}
                  className="w-28 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Status indicator */}
            {speechState.hasEverStarted && (
              <div className={`flex items-center justify-center gap-2 rounded-lg px-3 py-1 ${
                speechState.isPlaying && !speechState.isPaused
                  ? 'bg-green-50 border border-green-200'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <Volume2 className={`h-4 w-4 ${
                  speechState.isPlaying && !speechState.isPaused
                    ? 'text-green-600'
                    : speechState.isPlaying && speechState.isPaused
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`} />
                <span className={`text-sm ${
                  speechState.isPlaying && !speechState.isPaused
                    ? 'text-green-800'
                    : speechState.isPlaying && speechState.isPaused
                    ? 'text-amber-800'
                    : 'text-red-800'
                }`}>
                  {speechState.isPlaying && !speechState.isPaused
                    ? 'Playing'
                    : speechState.isPlaying && speechState.isPaused
                    ? 'Paused'
                    : 'Stopped'}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tablet: Two-column layout */}
      <div className="hidden sm:flex lg:hidden flex-col gap-4">
        {/* Top row: Title and playback controls */}
        <div className="flex items-center justify-around">
          {/* Title and paragraph info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Audio Controls</h3>
            <p className="text-sm text-gray-600">
              Paragraph {currentParagraph + 1} of {paragraphs.length}
            </p>
          </div>

          {/* Playback controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={speechState.currentParagraph === 0}
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
              onClick={() => stop(onParagraphChange)}
              disabled={!speechState.isPlaying}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              <Square className="h-4 w-4 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              disabled={speechState.currentParagraph >= paragraphs.length - 1}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              <SkipForward className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Bottom row: Speed controls and status */}
        <div className="flex items-center justify-around">
          {/* Speed controls */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Speed</label>
            
            {/* Preset speed buttons */}
            <div className="flex gap-1">
              {[0.5, 1, 1.5, 2].map((presetRate) => (
                <button
                  key={presetRate}
                  onClick={() => setRate(presetRate)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    Math.abs(speechState.rate - presetRate) < 0.05
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {presetRate}x
                </button>
              ))}
            </div>
            
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

          {/* Status indicator */}
          {speechState.hasEverStarted && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-1 ${
              speechState.isPlaying && !speechState.isPaused
                ? 'bg-green-50 border border-green-200'
                : speechState.isPlaying && speechState.isPaused
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <Volume2 className={`h-4 w-4 ${
                speechState.isPlaying && !speechState.isPaused
                  ? 'text-green-600'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`} />
              <span className={`text-sm whitespace-nowrap ${
                speechState.isPlaying && !speechState.isPaused
                  ? 'text-green-800'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'text-amber-800'
                  : 'text-red-800'
              }`}>
                {speechState.isPlaying && !speechState.isPaused
                  ? 'Playing'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'Paused'
                  : 'Stopped'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden lg:flex items-center justify-between gap-6">
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
            disabled={speechState.currentParagraph === 0}
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
            onClick={() => stop(onParagraphChange)}
            disabled={!speechState.isPlaying}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <Square className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            disabled={speechState.currentParagraph >= paragraphs.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Right side - Speed control and status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Speed</label>
            
            {/* Preset speed buttons */}
            <div className="flex gap-1">
              {[0.5, 1, 1.5, 2].map((presetRate) => (
                <button
                  key={presetRate}
                  onClick={() => setRate(presetRate)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    Math.abs(speechState.rate - presetRate) < 0.05
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {presetRate}x
                </button>
              ))}
            </div>
            
            <span className="text-sm text-gray-600 min-w-[3rem]">{speechState.rate}x</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechState.rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Status indicator */}
          {speechState.hasEverStarted && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-1 ${
              speechState.isPlaying && !speechState.isPaused
                ? 'bg-green-50 border border-green-200'
                : speechState.isPlaying && speechState.isPaused
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <Volume2 className={`h-4 w-4 ${
                speechState.isPlaying && !speechState.isPaused
                  ? 'text-green-600'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`} />
              <span className={`text-sm whitespace-nowrap ${
                speechState.isPlaying && !speechState.isPaused
                  ? 'text-green-800'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'text-amber-800'
                  : 'text-red-800'
              }`}>
                {speechState.isPlaying && !speechState.isPaused
                  ? 'Playing'
                  : speechState.isPlaying && speechState.isPaused
                  ? 'Paused'
                  : 'Stopped'}
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