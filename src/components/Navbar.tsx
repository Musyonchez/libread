'use client';

import Link from 'next/link';
import { BookOpen, Menu, X, FileText, Globe, Brain, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <BookOpen className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-xl font-bold text-gray-900">LibRead</span>
              <div className="hidden sm:flex items-center ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="h-3 w-3 mr-1" />
                4 Readers
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link
                href="/text"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                Text Reader
              </Link>
              <Link
                href="/document"
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <BookOpen className="h-4 w-4" />
                Documents
              </Link>
              <Link
                href="/web"
                className="flex items-center gap-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                Web Articles
              </Link>
              <Link
                href="/novel"
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative"
              >
                <Brain className="h-4 w-4" />
                Novels
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  NEW
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/text"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Start Reading
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
            <Link
              href="/text"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <div>
                <div className="font-semibold">Text Reader</div>
                <div className="text-xs text-gray-500">Paste and listen instantly</div>
              </div>
            </Link>
            <Link
              href="/document"
              className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <div>
                <div className="font-semibold">Document Reader</div>
                <div className="text-xs text-gray-500">Upload PDFs & Word docs</div>
              </div>
            </Link>
            <Link
              href="/web"
              className="flex items-center gap-3 text-gray-700 hover:text-violet-600 hover:bg-violet-50 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Globe className="h-5 w-5" />
              <div>
                <div className="font-semibold">Web Reader</div>
                <div className="text-xs text-gray-500">Any URL or article</div>
              </div>
            </Link>
            <Link
              href="/novel"
              className="flex items-center gap-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 relative"
              onClick={() => setIsMenuOpen(false)}
            >
              <Brain className="h-5 w-5" />
              <div>
                <div className="font-semibold flex items-center gap-2">
                  Novel Reader
                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                </div>
                <div className="text-xs text-gray-500">Chapter navigation & wuxiabox</div>
              </div>
            </Link>
            <div className="pt-4 border-t border-gray-200 mt-4">
              <Link
                href="/text"
                className="bg-blue-600 text-white block px-3 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors mx-3 text-center shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Reading Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}