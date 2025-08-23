'use client';

import { useState, useRef, useEffect } from 'react';
import NovelInput from '@/components/NovelInput';
import NovelContentDisplay from '@/components/NovelContentDisplay';
import ChapterNavigation from '@/components/ChapterNavigation';
import ReadingProgress from '@/components/ReadingProgress';
import TextToSpeechControls from '@/components/TextToSpeechControls';
import BrowserCompatibility from '@/components/BrowserCompatibility';
import { Loader2 } from 'lucide-react';

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

interface ReadingProgressData {
  url: string;
  title: string;
  currentParagraph: number;
  currentChapter?: number;
  lastRead: string;
  totalParagraphs: number;
}

export default function NovelReader() {
  const [novelData, setNovelData] = useState<NovelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [readingProgress, setReadingProgress] = useState<ReadingProgressData | null>(null);
  const jumpToParagraphRef = useRef<((index: number, paragraphs?: string[], onParagraphChange?: (index: number) => void) => void) | null>(null);

  // Load reading progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('libread-reading-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setReadingProgress(progress);
      } catch {
        // Ignore invalid data
      }
    }
  }, []);

  // Save reading progress whenever current paragraph changes
  useEffect(() => {
    if (novelData && currentParagraph >= 0) {
      const progress: ReadingProgressData = {
        url: novelData.url,
        title: novelData.title,
        currentParagraph,
        currentChapter: novelData.currentChapter || 0,
        lastRead: new Date().toISOString(),
        totalParagraphs: novelData.paragraphs.length,
      };
      localStorage.setItem('libread-reading-progress', JSON.stringify(progress));
      setReadingProgress(progress);
    }
  }, [novelData, currentParagraph]);

  const detectChapters = (content: string, paragraphs: string[]): Chapter[] => {
    const chapters: Chapter[] = [];
    let currentChapter: Chapter | null = null;
    let chapterIndex = 0;

    // Common chapter patterns for novels
    const chapterPatterns = [
      /^Chapter\s+\d+/i,
      /^Ch\.\s*\d+/i,
      /^第\d+章/,
      /^\d+\./,
      /^Part\s+\d+/i,
      /^Volume\s+\d+/i,
    ];

    paragraphs.forEach((paragraph) => {
      const isChapterTitle = chapterPatterns.some(pattern => pattern.test(paragraph.trim()));
      
      if (isChapterTitle && paragraph.trim().length < 100) {
        // Save previous chapter if exists
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        
        // Start new chapter
        currentChapter = {
          title: paragraph.trim(),
          content: '',
          paragraphs: [],
          index: chapterIndex++,
        };
      } else if (currentChapter) {
        // Add paragraph to current chapter
        currentChapter.content += paragraph + '\n\n';
        currentChapter.paragraphs.push(paragraph);
      } else {
        // No chapter detected yet, create a default first chapter
        if (chapters.length === 0) {
          currentChapter = {
            title: 'Chapter 1',
            content: '',
            paragraphs: [],
            index: 0,
          };
        }
        if (currentChapter) {
          currentChapter.content += paragraph + '\n\n';
          currentChapter.paragraphs.push(paragraph);
        }
      }
    });

    // Add the last chapter
    if (currentChapter) {
      chapters.push(currentChapter);
    }

    return chapters.length > 0 ? chapters : [{
      title: 'Full Content',
      content,
      paragraphs,
      index: 0,
    }];
  };

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fetch-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch content');
      }

      // Detect chapters in the content
      const chapters = detectChapters(result.data.content, result.data.paragraphs);
      
      const novelData: NovelData = {
        ...result.data,
        chapters,
        currentChapter: 0,
      };

      setNovelData(novelData);
      
      // Check if we have saved progress for this URL
      if (readingProgress && readingProgress.url === url) {
        setCurrentParagraph(readingProgress.currentParagraph);
      } else {
        setCurrentParagraph(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleParagraphClick = (index: number) => {
    setCurrentParagraph(index);
    if (jumpToParagraphRef.current && novelData) {
      jumpToParagraphRef.current(index, novelData.paragraphs, setCurrentParagraph);
    }
  };

  const handleChapterChange = (chapterIndex: number) => {
    if (!novelData || !novelData.chapters) return;

    // Calculate the starting paragraph index for the selected chapter
    let startParagraphIndex = 0;
    for (let i = 0; i < chapterIndex; i++) {
      startParagraphIndex += novelData.chapters[i].paragraphs.length;
    }

    setCurrentParagraph(startParagraphIndex);
    setNovelData({ ...novelData, currentChapter: chapterIndex });

    if (jumpToParagraphRef.current) {
      jumpToParagraphRef.current(startParagraphIndex, novelData.paragraphs, setCurrentParagraph);
    }
  };

  const handleResumeReading = () => {
    if (readingProgress && readingProgress.url) {
      handleUrlSubmit(readingProgress.url);
    }
  };

  const getCurrentChapterIndex = (): number => {
    if (!novelData?.chapters) return 0;

    let paragraphCount = 0;
    for (let i = 0; i < novelData.chapters.length; i++) {
      paragraphCount += novelData.chapters[i].paragraphs.length;
      if (currentParagraph < paragraphCount) {
        return i;
      }
    }
    return novelData.chapters.length - 1;
  };

  const getProgressPercentage = (): number => {
    if (!novelData) return 0;
    return Math.round((currentParagraph / novelData.paragraphs.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Novel Reader</h1>
          <p className="text-lg text-gray-600">
            Experience novels with chapter navigation, progress tracking, and immersive audio
          </p>
        </div>

        <BrowserCompatibility />

        {/* Resume Reading Card */}
        {readingProgress && !novelData && !loading && (
          <ReadingProgress
            progress={readingProgress}
            onResume={handleResumeReading}
          />
        )}

        <NovelInput onSubmit={handleUrlSubmit} disabled={loading} />

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Fetching novel content...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {novelData && !loading && (
          <div className="space-y-6">
            {/* Chapter Navigation */}
            {novelData.chapters && novelData.chapters.length > 1 && (
              <ChapterNavigation
                chapters={novelData.chapters}
                currentChapter={getCurrentChapterIndex()}
                onChapterChange={handleChapterChange}
              />
            )}

            {/* Progress Display */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                <span className="text-sm text-gray-500">
                  {getProgressPercentage()}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Paragraph {currentParagraph + 1} of {novelData.paragraphs.length}</span>
                {novelData.chapters && (
                  <span>
                    Chapter {getCurrentChapterIndex() + 1} of {novelData.chapters.length}
                  </span>
                )}
              </div>
            </div>

            {/* Sticky Audio Controls */}
            <div className="sticky top-16 z-40 bg-gray-50 pb-4">
              <TextToSpeechControls
                paragraphs={novelData.paragraphs}
                currentParagraph={currentParagraph}
                onParagraphChange={setCurrentParagraph}
                onJumpToParagraphRef={jumpToParagraphRef}
              />
            </div>

            {/* Novel Content Display */}
            <div className="max-w-4xl mx-auto">
              <NovelContentDisplay
                novel={novelData}
                currentParagraph={currentParagraph}
                onParagraphClick={handleParagraphClick}
                currentChapter={getCurrentChapterIndex()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}