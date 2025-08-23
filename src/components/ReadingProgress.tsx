'use client';

import { BookOpen, Clock, PlayCircle, X } from 'lucide-react';

interface ReadingProgressData {
  url: string;
  title: string;
  currentParagraph: number;
  currentChapter?: number;
  lastRead: string;
  totalParagraphs: number;
}

interface ReadingProgressProps {
  progress: ReadingProgressData;
  onResume: () => void;
  onClear?: () => void;
}

export default function ReadingProgress({ progress, onResume, onClear }: ReadingProgressProps) {
  const formatLastRead = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getProgressPercentage = (): number => {
    return Math.round((progress.currentParagraph / progress.totalParagraphs) * 100);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else {
      // Default behavior: clear from localStorage
      localStorage.removeItem('libread-reading-progress');
      window.location.reload(); // Simple refresh to update state
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                Continue Reading
              </h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {getProgressPercentage()}% complete
              </span>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-2 truncate">
              {progress.title}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last read {formatLastRead(progress.lastRead)}</span>
                </div>
                {progress.currentChapter !== undefined && (
                  <div>Chapter {progress.currentChapter + 1}</div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>
                    {progress.currentParagraph + 1} of {progress.totalParagraphs} paragraphs
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
          title="Clear reading progress"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onResume}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <PlayCircle className="h-5 w-5" />
          Resume Reading
        </button>
        
        <div className="text-xs text-gray-500 self-end">
          <p className="truncate">{progress.url}</p>
        </div>
      </div>
    </div>
  );
}