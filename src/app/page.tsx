import Link from 'next/link';
import { Play, BookOpen, FileText, Globe, Brain, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              4 Readers • Production Ready
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Transform Any Content into
              <span className="text-blue-600 block mt-2">Audio Experiences</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete text-to-speech platform with specialized readers for text, documents, web content, and novels. 
              Advanced speech controls, chapter navigation, and cross-platform compatibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/text"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Start Reading Now
              </Link>
              <Link
                href="/novel"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Brain className="h-5 w-5" />
                Try Novel Reader
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No sign-up required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Advanced speech controls
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Mobile responsive
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Chapter navigation
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Reading Style</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four specialized readers, each optimized for different content types and use cases
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/text" className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl h-full hover:shadow-lg transition-shadow">
                <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Text Reader</h3>
                <p className="text-gray-600 mb-4">Paste any text and listen instantly with save/load functionality</p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Production Ready
                </div>
              </div>
            </Link>

            <Link href="/document" className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl h-full hover:shadow-lg transition-shadow">
                <div className="bg-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Document Reader</h3>
                <p className="text-gray-600 mb-4">Upload PDFs, Word docs, and text files with drag & drop</p>
                <div className="flex items-center text-sm text-emerald-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Production Ready
                </div>
              </div>
            </Link>

            <Link href="/web" className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-8 rounded-2xl h-full hover:shadow-lg transition-shadow">
                <div className="bg-violet-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Web Reader</h3>
                <p className="text-gray-600 mb-4">Convert any article or blog post by URL with smart parsing</p>
                <div className="flex items-center text-sm text-violet-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Production Ready
                </div>
              </div>
            </Link>

            <Link href="/novel" className="group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl h-full hover:shadow-lg transition-shadow border-2 border-orange-200">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Novel Reader</h3>
                <p className="text-gray-600 mb-4">Advanced chapter navigation with wuxiabox support</p>
                <div className="flex items-center text-sm text-orange-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Production Ready
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Advanced Features for 
              <span className="text-blue-600">Every Reader</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic text input to sophisticated novel navigation—our platform adapts to how you actually consume content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🎧</div>
              <h3 className="font-bold text-gray-900 mb-3">Advanced Audio Controls</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Variable speed control (0.5x - 2x)</li>
                <li>• Play/pause with spacebar</li>
                <li>• Previous/next paragraph navigation</li>
                <li>• Real-time speed adjustments</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="font-bold text-gray-900 mb-3">Smart Content Parsing</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Automatic chapter detection</li>
                <li>• Wuxiabox URL navigation</li>
                <li>• Clean text extraction</li>
                <li>• PDF & DOCX support</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-bold text-gray-900 mb-3">Cross-Platform Ready</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Mobile-responsive design</li>
                <li>• Browser compatibility detection</li>
                <li>• Touch-friendly controls</li>
                <li>• Keyboard shortcuts</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="font-bold text-gray-900 mb-3">Local Storage & Sync</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Save and load text content</li>
                <li>• Modal-based UI (no alerts)</li>
                <li>• Drag & drop file uploads</li>
                <li>• Professional delete functionality</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-gray-900 mb-3">Precise Navigation</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Click paragraphs to jump</li>
                <li>• Chapter-by-chapter reading</li>
                <li>• Go-to chapter input</li>
                <li>• Visual progress indicators</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">♿</div>
              <h3 className="font-bold text-gray-900 mb-3">Accessibility First</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Screen reader compatible</li>
                <li>• High contrast indicators</li>
                <li>• Keyboard navigation</li>
                <li>• Content for everyone</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/text"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mr-4"
            >
              <Play className="h-5 w-5" />
              Start with Text Reader
            </Link>
            <Link
              href="/novel"
              className="inline-flex items-center gap-3 bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Brain className="h-5 w-5" />
              Try Novel Reader
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Reading?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands using LibRead to turn any content into immersive audio experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/text"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Text Reader
            </Link>
            <Link
              href="/document"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Documents
            </Link>
            <Link
              href="/web"
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="h-5 w-5" />
              Web Articles
            </Link>
            <Link
              href="/novel"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Brain className="h-5 w-5" />
              Novels
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              No registration • No limits • Works in your browser
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
