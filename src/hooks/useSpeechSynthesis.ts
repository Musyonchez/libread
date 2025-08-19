'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentParagraph: number;
}

export function useSpeechSynthesis() {
  const [speechState, setSpeechState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    rate: 1,
    currentParagraph: 0,
  });

  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const paragraphsRef = useRef<string[]>([]);
  const onParagraphChangeRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speak = useCallback((paragraphs: string[], startFromParagraph: number = 0, onParagraphChange?: (index: number) => void) => {
    if (!isSupported || !paragraphs.length) return;

    paragraphsRef.current = paragraphs;
    onParagraphChangeRef.current = onParagraphChange || null;

    const speakParagraph = (index: number) => {
      if (index >= paragraphs.length) {
        setSpeechState(prev => ({ ...prev, isPlaying: false, currentParagraph: 0 }));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
      utteranceRef.current = utterance;
      
      utterance.rate = speechState.rate;
      utterance.volume = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false, currentParagraph: index }));
        if (onParagraphChangeRef.current) {
          onParagraphChangeRef.current(index);
        }
      };

      utterance.onend = () => {
        if (index < paragraphs.length - 1) {
          speakParagraph(index + 1);
        } else {
          setSpeechState(prev => ({ ...prev, isPlaying: false, currentParagraph: 0 }));
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeechState(prev => ({ ...prev, isPlaying: false }));
      };

      speechSynthesis.speak(utterance);
    };

    speakParagraph(startFromParagraph);
  }, [isSupported, speechState.rate]);

  const pause = useCallback(() => {
    if (isSupported && speechSynthesis.speaking) {
      speechSynthesis.pause();
      setSpeechState(prev => ({ ...prev, isPaused: true }));
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && speechSynthesis.paused) {
      speechSynthesis.resume();
      setSpeechState(prev => ({ ...prev, isPaused: false }));
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setSpeechState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentParagraph: 0 }));
    }
  }, [isSupported]);

  const setRate = useCallback((rate: number) => {
    setSpeechState(prev => ({ ...prev, rate }));
    if (utteranceRef.current) {
      utteranceRef.current.rate = rate;
    }
  }, []);

  const jumpToParagraph = useCallback((paragraphIndex: number) => {
    if (speechState.isPlaying) {
      stop();
      setTimeout(() => {
        speak(paragraphsRef.current, paragraphIndex, onParagraphChangeRef.current || undefined);
      }, 100);
    }
  }, [speechState.isPlaying, stop, speak]);

  return {
    speechState,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    setRate,
    jumpToParagraph,
  };
}