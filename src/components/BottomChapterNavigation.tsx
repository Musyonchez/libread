'use client';

import { ChevronLeft, ChevronRight, Hash, ArrowUp } from 'lucide-react';
import { useState } from 'react';

interface Chapter {
  title: string;
  content: string;
  paragraphs: string[];
  index: number;
}

interface BottomChapterNavigationProps {
  chapters: Chapter[];
  currentChapter: number;
  currentUrl?: string;
  onChapterChange: (chapterIndex: number) => void;
  onUrlChange?: (url: string) => void;
}

export default function BottomChapterNavigation({
  chapters,
  currentChapter,
  currentUrl,
  onChapterChange,
  onUrlChange,
}: BottomChapterNavigationProps) {
  const [chapterInput, setChapterInput] = useState('');

  // Detect if this is a wuxiabox URL and extract chapter number
  const getWuxiaboxChapterInfo = (url: string) => {
    if (!url || !url.includes('wuxiabox.com')) return null;
    
    const match = url.match(/\/novel\/(\d+)_(\d+)\.html$/);
    if (match) {
      return {
        novelId: match[1],
        chapterNum: parseInt(match[2]),
        baseUrl: url.replace(/_\d+\.html$/, ''),
      };
    }
    return null;
  };

  const generateWuxiaboxUrl = (novelId: string, chapterNum: number) => {
    return `https://www.wuxiabox.com/novel/${novelId}_${chapterNum}.html`;
  };


  const handleChapterInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chapterNum = parseInt(chapterInput);
    
    // Check if this is a wuxiabox URL
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    
    if (wuxiaboxInfo && onUrlChange) {
      // For wuxiabox, generate new URL and fetch it
      const newUrl = generateWuxiaboxUrl(wuxiaboxInfo.novelId, chapterNum);
      onUrlChange(newUrl);
    } else if (chapterNum >= 1 && chapterNum <= chapters.length) {
      // For regular chapter navigation within current content
      onChapterChange(chapterNum - 1); // Convert to 0-based index
    }
    
    setChapterInput('');
  };

  const handleInputChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setChapterInput(numericValue);
  };

  // Handle next/previous chapter navigation
  const handleChapterChangeWithScroll = (chapterIndex: number) => {
    // Check if this is a wuxiabox URL
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    
    if (wuxiaboxInfo && onUrlChange) {
      // For wuxiabox, calculate new chapter number and generate URL
      const currentChapterNum = wuxiaboxInfo.chapterNum;
      let newChapterNum: number;
      
      if (chapterIndex > currentChapter) {
        // Next chapter
        newChapterNum = currentChapterNum + 1;
      } else {
        // Previous chapter, don't go below 1
        newChapterNum = Math.max(1, currentChapterNum - 1);
      }
      
      // Only proceed if we're not already at the boundary
      if (newChapterNum !== currentChapterNum) {
        const newUrl = generateWuxiaboxUrl(wuxiaboxInfo.novelId, newChapterNum);
        onUrlChange(newUrl);
      }
    } else {
      // Regular chapter navigation within current content
      onChapterChange(chapterIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get appropriate placeholder and limits for input
  const getInputPlaceholder = () => {
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    if (wuxiaboxInfo) {
      return `Chapter 1-999+`;  // For wuxiabox, allow wide range
    }
    return `1-${chapters.length}`;
  };

  const isValidChapterInput = (input: string) => {
    const num = parseInt(input);
    if (isNaN(num) || num < 1) return false;
    
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    if (wuxiaboxInfo) {
      return num >= 1 && num <= 999;  // Allow up to 999 for wuxiabox
    }
    return num >= 1 && num <= chapters.length;
  };

  const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
  const isWuxiabox = !!wuxiaboxInfo;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-8 border-t-4 border-blue-500">
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 mb-1">
            Chapter {currentChapter + 1}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleChapterChangeWithScroll(currentChapter - 1)}
            disabled={!isWuxiabox ? currentChapter === 0 : (wuxiaboxInfo?.chapterNum === 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Chapter
          </button>

          <button
            onClick={() => handleChapterChangeWithScroll(currentChapter + 1)}
            disabled={!isWuxiabox && currentChapter === chapters.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Chapter
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={chapterInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Jump to ${getInputPlaceholder()}`}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!chapterInput || !isValidChapterInput(chapterInput)}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Jump
            </button>
          </form>
          
          <button
            onClick={scrollToTop}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowUp className="h-4 w-4" />
            Back to Top
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleChapterChangeWithScroll(currentChapter - 1)}
              disabled={!isWuxiabox ? currentChapter === 0 : (wuxiaboxInfo?.chapterNum === 1)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous Chapter
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Chapter {currentChapter + 1}
              </div>
            </div>

            <button
              onClick={() => handleChapterChangeWithScroll(currentChapter + 1)}
              disabled={!isWuxiabox && currentChapter === chapters.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next Chapter
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="border-l border-gray-300 pl-6">
              <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Jump to:</span>
                <input
                  type="text"
                  value={chapterInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!chapterInput || !isValidChapterInput(chapterInput)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Jump
                </button>
              </form>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}