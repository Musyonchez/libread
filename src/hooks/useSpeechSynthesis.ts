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

    const chunkText = (text: string, maxLength: number = 200): string[] => {
      if (text.length <= maxLength) return [text];
      
      const chunks: string[] = [];
      const sentences = text.split(/[.!?]+/);
      let currentChunk = '';
      
      for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;
        
        const potentialChunk = currentChunk + (currentChunk ? '. ' : '') + trimmedSentence;
        
        if (potentialChunk.length <= maxLength) {
          currentChunk = potentialChunk;
        } else {
          if (currentChunk) {
            chunks.push(currentChunk + '.');
            currentChunk = trimmedSentence;
          } else {
            // If single sentence is too long, split by words
            const words = trimmedSentence.split(' ');
            let wordChunk = '';
            for (const word of words) {
              if ((wordChunk + ' ' + word).length <= maxLength) {
                wordChunk += (wordChunk ? ' ' : '') + word;
              } else {
                if (wordChunk) chunks.push(wordChunk);
                wordChunk = word;
              }
            }
            if (wordChunk) currentChunk = wordChunk;
          }
        }
      }
      
      if (currentChunk) {
        chunks.push(currentChunk + (currentChunk.match(/[.!?]$/) ? '' : '.'));
      }
      
      return chunks.filter(chunk => chunk.trim().length > 0);
    };

    const speakParagraph = (index: number, chunkIndex: number = 0) => {
      if (index >= paragraphs.length) {
        setSpeechState(prev => ({ ...prev, isPlaying: false, currentParagraph: 0 }));
        return;
      }

      const chunks = chunkText(paragraphs[index]);
      
      if (chunkIndex >= chunks.length) {
        // Move to next paragraph
        speakParagraph(index + 1, 0);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utteranceRef.current = utterance;
      
      utterance.rate = speechState.rate;
      utterance.volume = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false, currentParagraph: index }));
        if (onParagraphChangeRef.current && chunkIndex === 0) {
          onParagraphChangeRef.current(index);
        }
      };

      utterance.onend = () => {
        // Move to next chunk or next paragraph
        speakParagraph(index, chunkIndex + 1);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        if (event.error === 'synthesis-failed' && chunks[chunkIndex].length > 100) {
          // Try with shorter chunks by retrying current chunk
          speakParagraph(index, chunkIndex);
          return;
        }
        // Skip this chunk and continue with next
        speakParagraph(index, chunkIndex + 1);
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