'use client';

import { useState } from 'react';
import { Link, Play } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export default function URLInput({ onSubmit, disabled }: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const handleTryExample = () => {
    const exampleUrl = 'https://www.wuxiabox.com/novel/6987152_1.html';
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
            placeholder="Enter URL (e.g., https://example.com/article)"
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
            Fetch & Read
          </button>
          <button
            type="button"
            onClick={handleTryExample}
            disabled={disabled}
            className="flex-none bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Try Example
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Supports articles, blog posts, news sites, and web novels
        </p>
      </div>
    </div>
  );
}