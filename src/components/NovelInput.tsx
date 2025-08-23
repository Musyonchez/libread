'use client';

import { useState } from 'react';
import { Link, Play, BookOpen } from 'lucide-react';

interface NovelInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

const novelExamples = [
  {
    title: "Wuxia Novel",
    url: "https://www.wuxiabox.com/novel/6987152_1.html",
    description: "Chinese martial arts fiction"
  },
  {
    title: "Light Novel",
    url: "https://lightnovelworld.com/novel/",
    description: "Japanese light novels"
  },
  {
    title: "Web Novel",
    url: "https://royalroad.com/fiction/",
    description: "Original fantasy fiction"
  }
];

export default function NovelInput({ onSubmit, disabled }: NovelInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const handleTryExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    onSubmit(exampleUrl);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter novel URL (e.g., https://example.com/novel/chapter-1)"
            className="block w-full pl-10 pr-4 py-4 text-lg text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={disabled || !url.trim()}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            Read Novel
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Try these novel examples:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {novelExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleTryExample(example.url)}
              disabled={disabled}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm">{example.title}</div>
              <div className="text-xs text-gray-500 mt-1">{example.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Optimized for reading novels with chapters and long-form content
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <span>📚 Chapter detection</span>
          <span>📖 Reading progress</span>
          <span>🔖 Auto bookmarking</span>
          <span>⚡ Fast navigation</span>
        </div>
      </div>
    </div>
  );
}