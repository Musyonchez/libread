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
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Available voices:', voices.length);
        }
      };
      
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((paragraphs: string[], startFromParagraph: number = 0, onParagraphChange?: (index: number) => void) => {
    if (!isSupported || !paragraphs.length) return;

    // Cancel any existing speech
    speechSynthesis.cancel();

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

    const retryCount = new Map<string, number>();

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

      const text = chunks[chunkIndex];
      const chunkKey = `${index}-${chunkIndex}`;

      // Skip if this chunk has failed too many times
      const currentRetries = retryCount.get(chunkKey) || 0;
      if (currentRetries >= 3) {
        console.warn(`Skipping chunk after 3 failed attempts: ${text.substring(0, 50)}...`);
        speakParagraph(index, chunkIndex + 1);
        return;
      }

      // Clean the text - remove special characters that might cause issues
      const cleanText = text
        .replace(/[^\w\s.,!?;:()\-'"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText || cleanText.length < 3) {
        speakParagraph(index, chunkIndex + 1);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
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
        // Reset retry count on success
        retryCount.delete(chunkKey);
        // Move to next chunk or next paragraph
        speakParagraph(index, chunkIndex + 1);
      };

      utterance.onerror = (event) => {
        console.error(`Speech synthesis error for chunk ${chunkKey}:`, event.error);
        
        // Increment retry count
        retryCount.set(chunkKey, currentRetries + 1);
        
        if (event.error === 'synthesis-failed') {
          // Wait a bit before retrying or skipping
          setTimeout(() => {
            if (currentRetries < 2 && cleanText.length > 50) {
              // Try with an even shorter chunk
              const shorterChunks = chunkText(cleanText, 100);
              if (shorterChunks.length > 1) {
                // Split this chunk and try the first part
                const firstPart = shorterChunks[0];
                const utteranceRetry = new SpeechSynthesisUtterance(firstPart);
                utteranceRetry.rate = speechState.rate;
                utteranceRetry.volume = 1;
                utteranceRetry.pitch = 1;
                
                utteranceRetry.onend = () => {
                  retryCount.delete(chunkKey);
                  speakParagraph(index, chunkIndex + 1);
                };
                
                utteranceRetry.onerror = () => {
                  retryCount.set(chunkKey, 3); // Max retries
                  speakParagraph(index, chunkIndex + 1);
                };
                
                speechSynthesis.speak(utteranceRetry);
                return;
              }
            }
            
            // Skip this chunk and continue
            speakParagraph(index, chunkIndex + 1);
          }, 100);
        } else {
          // For other errors, skip immediately
          speakParagraph(index, chunkIndex + 1);
        }
      };

      // Small delay to prevent overwhelming the speech synthesis
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 50);
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