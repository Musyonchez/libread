'use client';

import { useState } from 'react';
import URLInput from '@/components/URLInput';
import TextToSpeechControls from '@/components/TextToSpeechControls';
import ContentDisplay from '@/components/ContentDisplay';
import { Loader2 } from 'lucide-react';

interface ContentData {
  title: string;
  url: string;
  content: string;
  paragraphs: string[];
  wordCount: number;
  estimatedReadTime: number;
}

export default function Reader() {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);

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

      setContentData(result.data);
      setCurrentParagraph(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Web Reader</h1>
          <p className="text-lg text-gray-600">
            Enter any URL to convert web content into audio
          </p>
        </div>

        <URLInput onSubmit={handleUrlSubmit} disabled={loading} />

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Fetching content...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {contentData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContentDisplay
                content={contentData}
                currentParagraph={currentParagraph}
                onParagraphClick={setCurrentParagraph}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <TextToSpeechControls
                  paragraphs={contentData.paragraphs}
                  currentParagraph={currentParagraph}
                  onParagraphChange={setCurrentParagraph}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}