'use client';

import { Clock, Eye, FileText, HardDrive } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

interface DocumentPreviewProps {
  document: DocumentData;
  currentParagraph: number;
  onParagraphClick: (index: number) => void;
}

export default function DocumentPreview({
  document,
  currentParagraph,
  onParagraphClick,
}: DocumentPreviewProps) {
  const currentParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (currentParagraphRef.current) {
      currentParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentParagraph]);

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('docx')) return '📝';
    if (fileType.includes('text')) return '📋';
    return '📄';
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'text-red-600 bg-red-50 border-red-200';
    if (fileType.includes('word') || fileType.includes('docx')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (fileType.includes('text')) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">{getFileTypeIcon(document.fileType)}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 break-words">{document.title}</h1>
            <p className="text-sm text-gray-500 break-words">{document.fileName}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{document.paragraphs.length} paragraphs</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{document.wordCount} words</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{document.estimatedReadTime} min read</span>
          </div>

          <div className="flex items-center gap-1">
            <HardDrive className="h-4 w-4" />
            <span>{document.fileSize}</span>
          </div>

          <div className={`px-2 py-1 rounded-full text-xs border ${getFileTypeColor(document.fileType)}`}>
            {document.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-none">
        {document.paragraphs.map((paragraph, index) => (
          <div
            key={index}
            ref={index === currentParagraph ? currentParagraphRef : null}
            onClick={() => onParagraphClick(index)}
            className={`mb-6 leading-relaxed cursor-pointer transition-all duration-200 p-4 rounded-lg text-lg ${
              index === currentParagraph
                ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900 shadow-sm'
                : 'hover:bg-gray-50 text-gray-800 border-l-4 border-transparent hover:border-gray-200'
            }`}
          >
            <p className="whitespace-pre-wrap">{paragraph}</p>
            {index === currentParagraph && (
              <div className="mt-2 text-sm text-blue-600 font-medium">
                ▶ Currently reading
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Paragraph {currentParagraph + 1} of {document.paragraphs.length}
          </span>
          <span>Click any paragraph to start reading from there</span>
        </div>
      </div>
    </div>
  );
}