import Link from 'next/link';
import { Play, Volume2, BookOpen, Zap, Globe, Headphones } from 'lucide-react';

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

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose LibRead?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of content consumption with our powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Volume2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Natural Voice Synthesis
              </h3>
              <p className="text-gray-600">
                High-quality, natural-sounding voices with adjustable speed and tone
                for the perfect listening experience.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Smart Content Parsing
              </h3>
              <p className="text-gray-600">
                Advanced algorithms extract clean, readable content from any webpage,
                removing ads and clutter automatically.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Paragraph Navigation
              </h3>
              <p className="text-gray-600">
                Click any paragraph to start reading from there, or use our intuitive
                controls to navigate through content seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Multiple Reading Modes
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Web Reader</h3>
                    <p className="text-gray-600">Convert any web article or blog post to audio</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Document Reader</h3>
                    <p className="text-gray-600">Upload PDFs, Word docs, and text files</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Headphones className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Text & Novel Readers</h3>
                    <p className="text-gray-600">Paste text directly or read novels with progress tracking</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Choose Your Reading Mode
                  </h3>
                  <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm text-gray-600">
                    Text • Document • Web • Novel
                  </div>
                  <Link
                    href="/web"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who are already enjoying hands-free content consumption
          </p>
          <Link
            href="/web"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Start Now - It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
