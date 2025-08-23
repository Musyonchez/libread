'use client';

import { useState, useRef } from 'react';
import NovelInput from '@/components/NovelInput';
import NovelContentDisplay from '@/components/NovelContentDisplay';
import ChapterNavigation from '@/components/ChapterNavigation';
import BottomChapterNavigation from '@/components/BottomChapterNavigation';
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


export default function NovelReader() {
  const [novelData, setNovelData] = useState<NovelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const jumpToParagraphRef = useRef<((index: number, paragraphs?: string[], onParagraphChange?: (index: number) => void) => void) | null>(null);


  const detectChapters = (content: string, paragraphs: string[], url: string): Chapter[] => {
    const chapters: Chapter[] = [];
    let currentChapter: Chapter | null = null;
    let chapterIndex = 0;

    // Common chapter patterns for novels
    const chapterPatterns = [
      /^Chapter\s+\d+/i,
      /^Ch\.\s*\d+/i,
      /^第\d+章/,
      /^\d+\.\s*[A-Za-z]/,  // "1. Chapter Title" format
      /^Part\s+\d+/i,
      /^Volume\s+\d+/i,
      /^\d+\s*-\s*[A-Za-z]/,  // "1 - Chapter Title" format
      /^[IVXLCDM]+\.\s*[A-Za-z]/i,  // Roman numerals "I. Title"
      /^\s*\d+\s*$/,  // Just numbers on their own line
      /chapter/i,     // Any line containing "chapter"
    ];

    paragraphs.forEach((paragraph) => {
      const isChapterTitle = chapterPatterns.some(pattern => pattern.test(paragraph.trim()));
      
      if (isChapterTitle && paragraph.trim().length < 200) {
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

    // If we found chapters, return them
    if (chapters.length > 1) {
      return chapters;
    }
    
    // For wuxiabox URLs, don't create artificial chapters - treat as single chapter
    const isWuxiabox = url.includes('wuxiabox.com');
    if (isWuxiabox) {
      return [{
        title: 'Current Chapter',
        content,
        paragraphs,
        index: 0,
      }];
    }
    
    // For non-wuxiabox URLs, create artificial chapters based on content length
    const artificialChapters: Chapter[] = [];
    const chunkSize = Math.max(10, Math.floor(paragraphs.length / 3)); // Split into ~3 parts, minimum 10 paragraphs each
    
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      const chapterParagraphs = paragraphs.slice(i, i + chunkSize);
      const chapterNumber = Math.floor(i / chunkSize) + 1;
      artificialChapters.push({
        title: `Section ${chapterNumber}`,
        content: chapterParagraphs.join('\n\n'),
        paragraphs: chapterParagraphs,
        index: artificialChapters.length,
      });
    }
    
    return artificialChapters.length > 1 ? artificialChapters : [{
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
      const chapters = detectChapters(result.data.content, result.data.paragraphs, url);
      
      const novelData: NovelData = {
        ...result.data,
        chapters,
        currentChapter: 0,
      };

      setNovelData(novelData);
      setCurrentParagraph(0);
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
            {novelData.chapters && (
              <ChapterNavigation
                chapters={novelData.chapters}
                currentChapter={getCurrentChapterIndex()}
                currentUrl={novelData.url}
                onChapterChange={handleChapterChange}
                onUrlChange={handleUrlSubmit}
              />
            )}


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

            {/* Bottom Chapter Navigation */}
            {novelData.chapters && (
              <div className="max-w-4xl mx-auto">
                <BottomChapterNavigation
                  chapters={novelData.chapters}
                  currentChapter={getCurrentChapterIndex()}
                  currentUrl={novelData.url}
                  onChapterChange={handleChapterChange}
                  onUrlChange={handleUrlSubmit}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}