'use client';

import Link from 'next/link';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LibRead</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/reader"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Reader
              </Link>
              <Link
                href="/about"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Link
              href="/reader"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/reader"
              className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              Reader
            </Link>
            <Link
              href="/about"
              className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              Contact
            </Link>
            <Link
              href="/reader"
              className="bg-blue-600 text-white block px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors mx-3 mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}