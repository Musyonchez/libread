'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { getPatternInfo, isDomainSupported } from '@/config/domainGroups';

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
  onUnsupportedDomain?: (domain: string) => void;
}

export default function ChapterNavigation({
  chapters,
  currentChapter,
  currentUrl,
  onChapterChange,
  onUrlChange,
  onUnsupportedDomain,
}: ChapterNavigationProps) {
  const [chapterInput, setChapterInput] = useState('');

  // Get navigation pattern info for current URL
  const getNavigationInfo = (url: string) => {
    if (!url) return null;
    return getPatternInfo(url);
  };

  const handlePrevious = () => {
    const navInfo = currentUrl ? getNavigationInfo(currentUrl) : null;
    
    if (navInfo && onUrlChange) {
      // For supported domain patterns, generate previous chapter URL
      const minChapter = navInfo.pattern.minChapter || 1;
      const newChapterNum = Math.max(minChapter, navInfo.chapterInfo.chapterNum - 1);
      if (newChapterNum !== navInfo.chapterInfo.chapterNum) {
        const newUrl = navInfo.pattern.generateUrl(navInfo.chapterInfo.novelId, newChapterNum);
        onUrlChange(newUrl);
      }
    } else if (currentUrl && !isDomainSupported(currentUrl) && onUnsupportedDomain) {
      // Handle unsupported domain
      const domain = new URL(currentUrl).hostname;
      onUnsupportedDomain(domain);
    } else if (currentChapter > 0) {
      onChapterChange(currentChapter - 1);
    }
  };

  const handleNext = () => {
    const navInfo = currentUrl ? getNavigationInfo(currentUrl) : null;
    
    if (navInfo && onUrlChange) {
      // For supported domain patterns, generate next chapter URL
      const maxChapter = navInfo.pattern.maxChapter || 999;
      const newChapterNum = Math.min(maxChapter, navInfo.chapterInfo.chapterNum + 1);
      const newUrl = navInfo.pattern.generateUrl(navInfo.chapterInfo.novelId, newChapterNum);
      onUrlChange(newUrl);
    } else if (currentUrl && !isDomainSupported(currentUrl) && onUnsupportedDomain) {
      // Handle unsupported domain
      const domain = new URL(currentUrl).hostname;
      onUnsupportedDomain(domain);
    } else if (currentChapter < chapters.length - 1) {
      onChapterChange(currentChapter + 1);
    }
  };


  const handleChapterInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chapterNum = parseInt(chapterInput);
    
    const navInfo = currentUrl ? getNavigationInfo(currentUrl) : null;
    
    if (navInfo && onUrlChange) {
      // For supported domain patterns, generate new URL
      const newUrl = navInfo.pattern.generateUrl(navInfo.chapterInfo.novelId, chapterNum);
      onUrlChange(newUrl);
    } else if (currentUrl && !isDomainSupported(currentUrl) && onUnsupportedDomain) {
      // Handle unsupported domain
      const domain = new URL(currentUrl).hostname;
      onUnsupportedDomain(domain);
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


  const isValidChapterInput = (input: string) => {
    const num = parseInt(input);
    if (isNaN(num) || num < 1) return false;
    
    const navInfo = currentUrl ? getNavigationInfo(currentUrl) : null;
    if (navInfo) {
      const min = navInfo.pattern.minChapter || 1;
      const max = navInfo.pattern.maxChapter || 999;
      return num >= min && num <= max;
    }
    return num >= 1 && num <= chapters.length;
  };

  const navInfo = currentUrl ? getNavigationInfo(currentUrl) : null;
  const isSupported = currentUrl ? isDomainSupported(currentUrl) : false;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Mobile: Responsive layout with wrapping */}
      <div className="sm:hidden">
        <div className="space-y-3">
          {/* Main navigation */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!isSupported ? currentChapter === 0 : !!(navInfo && navInfo.chapterInfo.chapterNum <= (navInfo.pattern.minChapter || 1))}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-900 whitespace-nowrap">
              Chapter {navInfo ? navInfo.chapterInfo.chapterNum : currentChapter + 1}
            </div>

            <button
              onClick={handleNext}
              disabled={!isSupported && currentChapter === chapters.length - 1}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Go to chapter input - wrapped below on mobile */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-gray-600">Go to chapter</span>
            <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={chapterInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="1"
                className="w-12 px-2 text-center text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 h-7"
              />
              <button
                type="submit"
                disabled={!chapterInput || !isValidChapterInput(chapterInput)}
                className={`px-3 rounded text-xs font-medium transition-colors h-7 ${
                  chapterInput && isValidChapterInput(chapterInput)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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
            disabled={!isSupported ? currentChapter === 0 : !!(navInfo && navInfo.chapterInfo.chapterNum <= (navInfo.pattern.minChapter || 1))}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>

          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg font-medium text-gray-900 whitespace-nowrap">
            Chapter {navInfo ? navInfo.chapterInfo.chapterNum : currentChapter + 1}
          </div>

          <button
            onClick={handleNext}
            disabled={!isSupported && currentChapter === chapters.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex-1"></div>

          {/* Go to chapter input */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Go to chapter</span>
            <form onSubmit={handleChapterInputSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={chapterInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="1"
                className="w-16 px-3 py-2 text-center font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 h-10"
              />
              <button
                type="submit"
                disabled={!chapterInput || !isValidChapterInput(chapterInput)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors h-10 ${
                  chapterInput && isValidChapterInput(chapterInput)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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