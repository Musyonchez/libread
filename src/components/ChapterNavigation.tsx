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
    <div className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${isWuxiabox ? 'border-l-4 border-orange-500' : ''}`}>
      {isWuxiabox && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800 text-sm">
            <span className="font-medium">🥊 Wuxiabox Navigation</span>
            <span className="text-orange-600">• Next/Prev loads new chapters</span>
          </div>
        </div>
      )}
      {/* Mobile: Compact layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">Chapters</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <div className="space-y-3">
          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={!isWuxiabox ? currentChapter === 0 : (wuxiaboxInfo?.chapterNum === 1)}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex-1 text-center px-2">
              <div className="text-sm font-medium text-gray-900 truncate">
                {(() => {
                  if (isWuxiabox && wuxiaboxInfo) {
                    return `Chapter ${wuxiaboxInfo.chapterNum}`;
                  }
                  return chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`;
                })()}
              </div>
              <div className="text-xs text-gray-500">
                {(() => {
                  if (isWuxiabox && wuxiaboxInfo) {
                    return `Wuxiabox Ch.${wuxiaboxInfo.chapterNum}`;
                  }
                  return `${currentChapter + 1} of ${chapters.length}`;
                })()}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isWuxiabox && currentChapter === chapters.length - 1}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Go to chapter input */}
          <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 whitespace-nowrap">Jump to:</span>
            <input
              type="text"
              value={chapterInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[80px]"
            />
            <button
              type="submit"
              disabled={!chapterInput || !isValidChapterInput(chapterInput)}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[60px]"
            >
              Go
            </button>
          </form>
        </div>

        {/* Expandable chapter list */}
        {isExpanded && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => handleChapterSelect(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    index === currentChapter
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="truncate">{chapter.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {chapter.paragraphs.length} paragraphs
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Full layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Chapters</h3>
            <span className="text-sm text-gray-500">
              ({chapters.length} total)
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={!isWuxiabox ? currentChapter === 0 : (wuxiaboxInfo?.chapterNum === 1)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="text-center px-4">
                <div className="text-sm font-medium text-gray-900">
                  {(() => {
                    if (isWuxiabox && wuxiaboxInfo) {
                      return `Chapter ${wuxiaboxInfo.chapterNum}`;
                    }
                    return `${currentChapter + 1} of ${chapters.length}`;
                  })()}
                </div>
                {isWuxiabox && wuxiaboxInfo && (
                  <div className="text-xs text-orange-600">
                    Novel {wuxiaboxInfo.novelId}
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={!isWuxiabox && currentChapter === chapters.length - 1}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Go to chapter input - Desktop */}
            <div className="border-l border-gray-300 pl-6">
              <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 whitespace-nowrap">Jump to:</span>
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
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[60px]"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Current chapter info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`}
              </h4>
              <p className="text-sm text-gray-600">
                {chapters[currentChapter]?.paragraphs.length} paragraphs
              </p>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isExpanded ? 'Hide All' : 'Show All'}
              {isExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* All chapters dropdown */}
        {isExpanded && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => handleChapterSelect(index)}
                  className={`text-left p-3 rounded-lg text-sm transition-all duration-200 border ${
                    index === currentChapter
                      ? 'bg-blue-100 border-blue-300 text-blue-900 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium truncate">{chapter.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {chapter.paragraphs.length} paragraphs
                  </div>
                  {index === currentChapter && (
                    <div className="text-xs text-blue-600 mt-1 font-medium">
                      Currently reading
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}