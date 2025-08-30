'use client';

import { ChevronLeft, ChevronRight, BookOpen, Menu, X, Hash } from 'lucide-react';
import { useState } from 'react';

interface Chapter {
  title: string;
  content: string;
  paragraphs: string[];
  index: number;
}

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapter: number;
  currentUrl?: string;
  onChapterChange: (chapterIndex: number) => void;
  onUrlChange?: (url: string) => void;
}

export default function ChapterNavigation({
  chapters,
  currentChapter,
  currentUrl,
  onChapterChange,
  onUrlChange,
}: ChapterNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handlePrevious = () => {
    // Check if this is a wuxiabox URL
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    
    if (wuxiaboxInfo && onUrlChange) {
      // For wuxiabox, generate previous chapter URL
      const newChapterNum = Math.max(1, wuxiaboxInfo.chapterNum - 1);
      if (newChapterNum !== wuxiaboxInfo.chapterNum) {
        const newUrl = generateWuxiaboxUrl(wuxiaboxInfo.novelId, newChapterNum);
        onUrlChange(newUrl);
      }
    } else if (currentChapter > 0) {
      onChapterChange(currentChapter - 1);
    }
  };

  const handleNext = () => {
    // Check if this is a wuxiabox URL
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    
    if (wuxiaboxInfo && onUrlChange) {
      // For wuxiabox, generate next chapter URL
      const newChapterNum = wuxiaboxInfo.chapterNum + 1;
      const newUrl = generateWuxiaboxUrl(wuxiaboxInfo.novelId, newChapterNum);
      onUrlChange(newUrl);
    } else if (currentChapter < chapters.length - 1) {
      onChapterChange(currentChapter + 1);
    }
  };

  const handleChapterSelect = (chapterIndex: number) => {
    onChapterChange(chapterIndex);
    setIsExpanded(false);
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

  // Get appropriate placeholder and limits for input
  const getInputPlaceholder = () => {
    const wuxiaboxInfo = currentUrl ? getWuxiaboxChapterInfo(currentUrl) : null;
    if (wuxiaboxInfo) {
      return `1-999+`;  // For wuxiabox, allow wide range
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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Mobile: Compact one-line layout */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={!isWuxiabox ? currentChapter === 0 : (wuxiaboxInfo?.chapterNum === 1)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-900">
            Ch. {currentChapter + 1}
          </div>

          <button
            onClick={handleNext}
            disabled={!isWuxiabox && currentChapter === chapters.length - 1}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="flex-1"></div>

          {/* Go to chapter input */}
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3 text-gray-500" />
            <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={chapterInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="1"
                className="w-10 px-2 py-1 text-center text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!chapterInput || !isValidChapterInput(chapterInput)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-2 py-1 rounded text-xs font-medium transition-colors disabled:cursor-not-allowed"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop: One-line layout */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={!isWuxiabox ? currentChapter === 0 : (wuxiaboxInfo?.chapterNum === 1)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>

          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg font-medium text-gray-900">
            Chapter {currentChapter + 1}
          </div>

          <button
            onClick={handleNext}
            disabled={!isWuxiabox && currentChapter === chapters.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex-1"></div>

          {/* Go to chapter input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-600">
              <Hash className="h-4 w-4" />
              <span className="text-sm font-medium">Go to chapter</span>
            </div>
            <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={chapterInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="1"
                className="w-16 px-3 py-2 text-center font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!chapterInput || !isValidChapterInput(chapterInput)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}