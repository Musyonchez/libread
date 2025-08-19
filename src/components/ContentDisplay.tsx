'use client';

import { Clock, Eye, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ContentData {
  title: string;
  url: string;
  content: string;
  paragraphs: string[];
  wordCount: number;
  estimatedReadTime: number;
}

interface ContentDisplayProps {
  content: ContentData;
  currentParagraph: number;
  onParagraphClick: (index: number) => void;
}

export default function ContentDisplay({
  content,
  currentParagraph,
  onParagraphClick,
}: ContentDisplayProps) {
  const currentParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (currentParagraphRef.current) {
      currentParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentParagraph]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 truncate max-w-md"
            >
              {content.url}
            </a>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{content.wordCount} words</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{content.estimatedReadTime} min read</span>
          </div>
        </div>
      </div>

      <div className="p-6 prose prose-lg max-w-none">
        {content.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            ref={index === currentParagraph ? currentParagraphRef : null}
            onClick={() => onParagraphClick(index)}
            className={`mb-4 leading-relaxed cursor-pointer transition-all duration-200 p-3 rounded-lg ${
              index === currentParagraph
                ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900'
                : 'hover:bg-gray-50 text-gray-800'
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Paragraph {currentParagraph + 1} of {content.paragraphs.length}
          </span>
          <span>Click any paragraph to start reading from there</span>
        </div>
      </div>
    </div>
  );
}