'use client';

import { useState, useRef } from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentPreview from '@/components/DocumentPreview';
import TextToSpeechControls from '@/components/TextToSpeechControls';
import BrowserCompatibility from '@/components/BrowserCompatibility';
import { Loader2 } from 'lucide-react';

interface DocumentData {
  title: string;
  content: string;
  paragraphs: string[];
  wordCount: number;
  estimatedReadTime: number;
  fileType: string;
  fileSize: string;
  fileName: string;
}

export default function DocumentReader() {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const jumpToParagraphRef = useRef<((index: number, paragraphs?: string[], onParagraphChange?: (index: number) => void) => void) | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setDocumentData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse document');
      }

      setDocumentData(result.data);
      setCurrentParagraph(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the document');
    } finally {
      setLoading(false);
    }
  };

  const handleParagraphClick = (index: number) => {
    setCurrentParagraph(index);
    if (jumpToParagraphRef.current && documentData) {
      jumpToParagraphRef.current(index, documentData.paragraphs, setCurrentParagraph);
    }
  };

  const handleReset = () => {
    setDocumentData(null);
    setCurrentParagraph(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Document Reader</h1>
          <p className="text-lg text-gray-600">
            Upload PDF, Word documents, or text files to convert them into audio
          </p>
        </div>

        <BrowserCompatibility />

        {!documentData && !loading && (
          <DocumentUpload onUpload={handleFileUpload} disabled={loading} />
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Processing document...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={handleReset}
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Try uploading another document
            </button>
          </div>
        )}

        {documentData && !loading && (
          <div className="space-y-6">
            {/* Action buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2"
              >
                ← Upload another document
              </button>
              <div className="text-sm text-gray-500">
                Document processed successfully
              </div>
            </div>

            {/* Sticky Audio Controls */}
            <div className="sticky top-16 z-40 bg-gray-50 pb-4">
              <TextToSpeechControls
                paragraphs={documentData.paragraphs}
                currentParagraph={currentParagraph}
                onParagraphChange={setCurrentParagraph}
                onJumpToParagraphRef={jumpToParagraphRef}
              />
            </div>

            {/* Document Preview */}
            <div className="max-w-4xl mx-auto">
              <DocumentPreview
                document={documentData}
                currentParagraph={currentParagraph}
                onParagraphClick={handleParagraphClick}
              />
            </div>
          </div>
        )}

        {!documentData && !loading && !error && (
          <div className="mt-12 text-center text-gray-500">
            <div className="space-y-2">
              <p className="text-lg font-medium">Supported File Types</p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span>📄</span>
                  <span>PDF Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span>Word Documents (.docx)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Text Files (.txt, .md, .rtf)</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}