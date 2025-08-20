'use client';

import { FileText, Clock, Eye } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TextDisplayProps {
  paragraphs: string[];
  currentParagraph: number;
  onParagraphClick: (index: number) => void;
  wordCount: number;
  estimatedReadTime: number;
}

export default function TextDisplay({
  paragraphs,
  currentParagraph,
  onParagraphClick,
  wordCount,
  estimatedReadTime,
}: TextDisplayProps) {
  const currentParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (currentParagraphRef.current) {
      currentParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentParagraph]);

  if (paragraphs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Listen?
          </h3>
          <p className="text-gray-600 mb-4">
            Paste your text above to get started. LibRead will automatically split it into paragraphs and make it ready for audio playback.
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Separate paragraphs with double line breaks</p>
            <p>• Click any paragraph to jump to that section</p>
            <p>• Use the audio controls to adjust speed and navigate</p>
            <p>• Save frequently used texts for easy access</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Text</h2>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{paragraphs.length} paragraphs</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{wordCount} words</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedReadTime} min read</span>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-none">
          {paragraphs.map((paragraph, index) => (
            <div
              key={index}
              ref={index === currentParagraph ? currentParagraphRef : null}
              onClick={() => onParagraphClick(index)}
              className={`mb-6 leading-relaxed cursor-pointer transition-all duration-200 p-4 rounded-lg text-lg ${
                index === currentParagraph
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900 shadow-sm'
                  : 'hover:bg-gray-50 text-gray-800 border-l-4 border-transparent hover:border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{paragraph}</p>
              {index === currentParagraph && (
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  ▶ Currently reading
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Paragraph {currentParagraph + 1} of {paragraphs.length}
            </span>
            <span>Click any paragraph to start reading from there</span>
          </div>
        </div>
      </div>
    </div>
  );
}