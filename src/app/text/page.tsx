'use client';

import { useState, useRef } from 'react';
import TextToSpeechControls from '@/components/TextToSpeechControls';
import BrowserCompatibility from '@/components/BrowserCompatibility';
import TextInput from '@/components/TextInput';
import TextDisplay from '@/components/TextDisplay';

export default function TextReader() {
  const [text, setText] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const jumpToParagraphRef = useRef<((index: number, paragraphs?: string[]) => void) | null>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);
    
    // Split text into paragraphs, filtering out empty ones
    const newParagraphs = newText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    setParagraphs(newParagraphs);
    setCurrentParagraph(0);
  };

  const handleParagraphClick = (index: number) => {
    setCurrentParagraph(index);
    if (jumpToParagraphRef.current) {
      jumpToParagraphRef.current(index, paragraphs);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedReadTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Text Reader</h1>
          <p className="text-lg text-gray-600">
            Paste any text below and convert it to audio instantly
          </p>
        </div>

        <BrowserCompatibility />

        <div className="space-y-6">
          {/* Text Input Section */}
          <TextInput
            text={text}
            onTextChange={handleTextChange}
            wordCount={wordCount}
            charCount={charCount}
            estimatedReadTime={estimatedReadTime}
          />

          {/* Audio Controls - Only show if there's text */}
          {paragraphs.length > 0 && (
            <div className="sticky top-16 z-40 bg-gray-50 pb-4">
              <TextToSpeechControls
                paragraphs={paragraphs}
                currentParagraph={currentParagraph}
                onParagraphChange={setCurrentParagraph}
                onJumpToParagraphRef={jumpToParagraphRef}
              />
            </div>
          )}

          {/* Text Display */}
          <TextDisplay
            paragraphs={paragraphs}
            currentParagraph={currentParagraph}
            onParagraphClick={handleParagraphClick}
            wordCount={wordCount}
            estimatedReadTime={estimatedReadTime}
          />
        </div>
      </div>
    </div>
  );
}