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
      
      // Load voices
      const loadVoices = () => {
        speechSynthesis.getVoices();
      };
      
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((paragraphs: string[], startFromParagraph: number = 0, onParagraphChange?: (index: number) => void) => {
    if (!isSupported || !paragraphs.length) return;

    // Check if voices are available
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      setSpeechState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    // Cancel any existing speech
    speechSynthesis.cancel();
    
    // Wait a moment for cancel to complete
    setTimeout(() => {
      paragraphsRef.current = paragraphs;
      onParagraphChangeRef.current = onParagraphChange || null;

      const speakParagraph = (index: number) => {
        if (index >= paragraphs.length) {
          setSpeechState(prev => ({ ...prev, isPlaying: false, currentParagraph: 0 }));
          return;
        }

        const text = paragraphs[index];
        
        // Skip empty or very short paragraphs
        if (!text || text.trim().length < 10) {
          speakParagraph(index + 1);
          return;
        }

        // Clean and limit text length to prevent synthesis issues
        let cleanText = text
          .replace(/[^\w\s.,!?;:()\-'"]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Truncate very long paragraphs
        if (cleanText.length > 400) {
          cleanText = cleanText.substring(0, 400) + '.';
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utteranceRef.current = utterance;
        
        // Use default voice and settings for better compatibility
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Prefer English voices
          const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
          if (englishVoice) {
            utterance.voice = englishVoice;
          }
        }
        
        utterance.rate = Math.max(0.5, Math.min(2, speechState.rate));
        utterance.volume = 1;
        utterance.pitch = 1;

        utterance.onstart = () => {
          setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false, currentParagraph: index }));
          if (onParagraphChangeRef.current) {
            onParagraphChangeRef.current(index);
          }
        };

        utterance.onend = () => {
          // Move to next paragraph
          setTimeout(() => speakParagraph(index + 1), 100);
        };

        utterance.onerror = () => {
          // Skip this paragraph and continue with the next
          setTimeout(() => speakParagraph(index + 1), 100);
        };

        // Start speaking
        speechSynthesis.speak(utterance);
      };

      speakParagraph(startFromParagraph);
    }, 100);
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
      utteranceRef.current = null;
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