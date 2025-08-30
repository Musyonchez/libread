'use client';

import { Clock, Eye, ExternalLink, BookOpen } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Chapter {
  title: string;
  content: string;
  paragraphs: string[];
  index: number;
}

interface NovelData {
  title: string;
  url: string;
  content: string;
  paragraphs: string[];
  wordCount: number;
  estimatedReadTime: number;
  chapters?: Chapter[];
  currentChapter?: number;
}

interface NovelContentDisplayProps {
  novel: NovelData;
  currentParagraph: number;
  onParagraphClick: (index: number) => void;
  currentChapter: number;
}

export default function NovelContentDisplay({
  novel,
  currentParagraph,
  onParagraphClick,
  currentChapter,
}: NovelContentDisplayProps) {
  const currentParagraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentParagraphRef.current) {
      currentParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentParagraph]);

  const getChapterStartIndex = (chapterIndex: number): number => {
    if (!novel.chapters) return 0;
    
    let startIndex = 0;
    for (let i = 0; i < chapterIndex; i++) {
      startIndex += novel.chapters[i].paragraphs.length;
    }
    return startIndex;
  };

  const getParagraphChapter = (paragraphIndex: number): number => {
    if (!novel.chapters) return 0;
    
    let cumulative = 0;
    for (let i = 0; i < novel.chapters.length; i++) {
      cumulative += novel.chapters[i].paragraphs.length;
      if (paragraphIndex < cumulative) {
        return i;
      }
    }
    return novel.chapters.length - 1;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Novel Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-full hidden sm:block">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 break-words text-center sm:text-left">{novel.title}</h1>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            <a
              href={novel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 truncate max-w-md"
            >
              {novel.url}
            </a>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{novel.wordCount} words</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{novel.estimatedReadTime} min read</span>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-none">
        {novel.paragraphs.map((paragraph, index) => {
          const paragraphChapter = getParagraphChapter(index);
          const isNewChapter = novel.chapters && 
            novel.chapters.length > 1 && 
            index === getChapterStartIndex(paragraphChapter) &&
            paragraphChapter > 0;

          return (
            <div key={index}>
              {/* Paragraph */}
              <div
                ref={index === currentParagraph ? currentParagraphRef : null}
                onClick={() => onParagraphClick(index)}
                className={`mb-6 leading-relaxed cursor-pointer transition-all duration-200 p-4 rounded-lg text-lg ${
                  index === currentParagraph
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900 shadow-sm'
                    : paragraphChapter === currentChapter
                    ? 'hover:bg-gray-50 text-gray-800 border-l-4 border-transparent hover:border-gray-200'
                    : 'hover:bg-gray-50 text-gray-600 border-l-4 border-transparent hover:border-gray-200 opacity-75'
                }`}
              >
                <p className="whitespace-pre-wrap">{paragraph}</p>
                {index === currentParagraph && (
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    ▶ Currently reading
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-600">
          <div>
            Paragraph {currentParagraph + 1} of {novel.paragraphs.length}
            {novel.chapters && (
              <span className="ml-2">
                • Chapter {getParagraphChapter(currentParagraph) + 1} of {novel.chapters.length}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Click any paragraph to start reading from there
          </div>
        </div>
      </div>
    </div>
  );
}