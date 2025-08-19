import Link from 'next/link';
import { Play, Volume2, BookOpen, FileText, Globe, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Transform Any Content into
              <span className="text-blue-600 block mt-2">Audio Experiences</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Convert text, documents, web articles, or novels into immersive audio with our 
              advanced text-to-speech technology. Listen while you work, commute, or relax.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/web"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Start Reading Now
              </Link>
              <Link
                href="#demo"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Watch Demo
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              No sign-up required • Works with any URL • Free to use
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl h-full">
                <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Text</h3>
                <p className="text-gray-600">Paste any text and listen instantly</p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl h-full">
                <div className="bg-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Document</h3>
                <p className="text-gray-600">Upload PDFs, Word docs, and more</p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-8 rounded-2xl h-full">
                <div className="bg-violet-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Web</h3>
                <p className="text-gray-600">Any article or blog post by URL</p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl h-full">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Novel</h3>
                <p className="text-gray-600">Chapter tracking and progress saving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Made for how you 
            <span className="text-blue-600">actually</span> consume content
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Whether you&apos;re driving, exercising, working, or just prefer listening—
            turn any text into your personal audiobook in seconds.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="font-semibold text-gray-900 mb-2">While commuting</h3>
              <p className="text-gray-600 text-sm">Turn travel time into learning time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="font-semibold text-gray-900 mb-2">During workouts</h3>
              <p className="text-gray-600 text-sm">Stay motivated with great content</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">♿</div>
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">Content should be for everyone</p>
            </div>
          </div>

          <Link
            href="/web"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Play className="h-5 w-5" />
            Try with any URL
          </Link>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to listen?
          </h2>
          <Link
            href="/web"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Try it now
          </Link>
        </div>
      </section>
    </div>
  );
}
