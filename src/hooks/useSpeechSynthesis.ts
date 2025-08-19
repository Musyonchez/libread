'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentParagraph: number;
  hasEverStarted: boolean;
}

export function useSpeechSynthesis() {
  const [speechState, setSpeechState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    rate: 1,
    currentParagraph: 0,
    hasEverStarted: false,
  });

  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const paragraphsRef = useRef<string[]>([]);
  const onParagraphChangeRef = useRef<((index: number) => void) | null>(null);
  const pausedAtParagraphRef = useRef<number>(0);
  const isPausingRef = useRef<boolean>(false);
  const isJumpingRef = useRef<boolean>(false);
  const isStoppingRef = useRef<boolean>(false);
  const isChangingRateRef = useRef<boolean>(false);

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

  const speak = useCallback((paragraphs: string[], startFromParagraph: number = 0, onParagraphChange?: (index: number) => void, overrideRate?: number) => {
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
      isPausingRef.current = false;
      isJumpingRef.current = false;
      isStoppingRef.current = false;
      isChangingRateRef.current = false;
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
        
        utterance.rate = Math.max(0.5, Math.min(2, overrideRate ?? speechState.rate));
        utterance.volume = 1;
        utterance.pitch = 1;

        utterance.onstart = () => {
          setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false, currentParagraph: index, hasEverStarted: true }));
          if (onParagraphChangeRef.current) {
            onParagraphChangeRef.current(index);
          }
        };

        utterance.onend = () => {
          // Only move to next paragraph if we're not pausing, jumping, stopping, or changing rate
          if (!isPausingRef.current && !isJumpingRef.current && !isStoppingRef.current && !isChangingRateRef.current) {
            setTimeout(() => speakParagraph(index + 1), 100);
          }
        };

        utterance.onerror = () => {
          // Only skip to next paragraph if we're not pausing, jumping, stopping, or changing rate
          if (!isPausingRef.current && !isJumpingRef.current && !isStoppingRef.current && !isChangingRateRef.current) {
            setTimeout(() => speakParagraph(index + 1), 100);
          }
        };

        // Start speaking
        speechSynthesis.speak(utterance);
      };

      speakParagraph(startFromParagraph);
    }, 100);
  }, [isSupported, speechState.rate]);

  const pause = useCallback(() => {
    if (isSupported && speechSynthesis.speaking) {
      // Set pausing flag to prevent auto-progression
      isPausingRef.current = true;
      // Store current paragraph for resume
      pausedAtParagraphRef.current = speechState.currentParagraph;
      speechSynthesis.cancel();
      setSpeechState(prev => ({ ...prev, isPaused: true }));
    }
  }, [isSupported, speechState.currentParagraph]);

  const resume = useCallback(() => {
    if (isSupported && speechState.isPaused) {
      // Clear pausing flag to allow normal progression
      isPausingRef.current = false;
      setSpeechState(prev => ({ ...prev, isPaused: false }));
      // Resume from where we paused
      speak(paragraphsRef.current, pausedAtParagraphRef.current, onParagraphChangeRef.current || undefined);
    }
  }, [isSupported, speechState.isPaused, speak]);

  const stop = useCallback(() => {
    if (isSupported) {
      // Set stopping flag to prevent auto-progression
      isStoppingRef.current = true;
      isPausingRef.current = false;
      isJumpingRef.current = false;
      speechSynthesis.cancel();
      utteranceRef.current = null;
      pausedAtParagraphRef.current = 0;
      // Reset to first paragraph (index 0)
      setSpeechState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentParagraph: 0 }));
      // Also update the parent component's current paragraph
      if (onParagraphChangeRef.current) {
        onParagraphChangeRef.current(0);
      }
      // Clear stopping flag after a brief delay
      setTimeout(() => {
        isStoppingRef.current = false;
      }, 200);
    }
  }, [isSupported]);

  const setRate = useCallback((rate: number) => {
    setSpeechState(prev => ({ ...prev, rate }));
    
    // If currently playing, restart the current paragraph with new speed
    if (speechState.isPlaying && !speechState.isPaused) {
      const currentParagraph = speechState.currentParagraph;
      
      // Set rate changing flag to prevent auto-progression
      isChangingRateRef.current = true;
      speechSynthesis.cancel();
      
      // Restart current paragraph with new speed after a brief delay
      setTimeout(() => {
        isChangingRateRef.current = false;
        speak(paragraphsRef.current, currentParagraph, onParagraphChangeRef.current || undefined, rate);
      }, 100);
    }
  }, [speechState.isPlaying, speechState.isPaused, speechState.currentParagraph, speak]);

  const jumpToParagraph = useCallback((paragraphIndex: number, paragraphs?: string[]) => {
    // Set jumping flag to prevent auto-progression from canceled speech
    isJumpingRef.current = true;
    
    // Always stop any current speech first
    speechSynthesis.cancel();
    isPausingRef.current = false;
    
    // Use provided paragraphs or fall back to ref
    const paragraphsToUse = paragraphs || paragraphsRef.current;
    
    // Always start playing from the clicked paragraph
    setTimeout(() => {
      isJumpingRef.current = false; // Clear flag before speaking
      speak(paragraphsToUse, paragraphIndex, onParagraphChangeRef.current || undefined);
    }, 100);
  }, [speak]);

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