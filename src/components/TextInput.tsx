'use client';

import { FileText, Save, Upload, X, Check } from 'lucide-react';
import { useState } from 'react';

interface SavedText {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  wordCount: number;
}

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
  wordCount: number;
  charCount: number;
  estimatedReadTime: number;
}

export default function TextInput({
  text,
  onTextChange,
  wordCount,
  charCount,
  estimatedReadTime,
}: TextInputProps) {
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  const handleClear = () => {
    onTextChange('');
  };

  const handleExample = () => {
    const sampleText = `Welcome to LibRead's Text Reader!

This is your first paragraph. You can paste any text here and it will be converted to speech automatically.

This is a second paragraph. Notice how paragraphs are separated by double line breaks. Each paragraph can be clicked individually to start reading from that point.

Try pasting an article, essay, or any text content you'd like to listen to. The speech controls below will help you navigate through your content with play, pause, speed controls, and more.

You can also save your text to local storage and load it later, making it easy to return to longer documents or frequently accessed content.`;
    onTextChange(sampleText);
  };

  const handleSave = () => {
    if (text.trim()) {
      const existingSavedTexts = JSON.parse(localStorage.getItem('libread-saved-texts') || '[]');
      const newText = {
        id: Date.now(),
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        content: text,
        createdAt: new Date().toISOString(),
        wordCount,
      };
      existingSavedTexts.unshift(newText);
      // Keep only the 10 most recent
      existingSavedTexts.splice(10);
      localStorage.setItem('libread-saved-texts', JSON.stringify(existingSavedTexts));
      
      // Show success toast
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    }
  };

  const handleLoad = () => {
    const loadedTexts = JSON.parse(localStorage.getItem('libread-saved-texts') || '[]');
    setSavedTexts(loadedTexts);
    setShowLoadModal(true);
  };

  const handleSelectText = (selectedText: SavedText) => {
    onTextChange(selectedText.content);
    setShowLoadModal(false);
  };

  const handleDeleteText = (e: React.MouseEvent, textId: number) => {
    e.stopPropagation(); // Prevent triggering the select action
    const updatedTexts = savedTexts.filter(text => text.id !== textId);
    setSavedTexts(updatedTexts);
    localStorage.setItem('libread-saved-texts', JSON.stringify(updatedTexts));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Enter Your Text</h2>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          {wordCount > 0 && <span>{estimatedReadTime} min read</span>}
        </div>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your text here... Each paragraph will be read separately. Use double line breaks to separate paragraphs."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        style={{ minHeight: '16rem' }}
      />
      
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleExample}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Example
        </button>
        {text.trim() && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        )}
        <button
          onClick={handleLoad}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Load Saved
        </button>
      </div>
      
      {text.trim() && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Ready to listen!</strong> Your text has been split into {text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length} paragraphs. 
            Use the audio controls below to start playback.
          </p>
        </div>
      )}

      {/* Success Toast */}
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
          <Check className="h-5 w-5" />
          <span>Text saved successfully!</span>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Load Saved Text</h3>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {savedTexts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No saved texts found.</p>
                  <p className="text-sm text-gray-500 mt-2">Save some text first to see it here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTexts.map((savedText: SavedText) => (
                    <div
                      key={savedText.id}
                      onClick={() => handleSelectText(savedText)}
                      className="relative p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteText(e, savedText.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200"
                        title="Delete this saved text"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="flex justify-between items-start mb-2 pr-8">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{savedText.title}</h4>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{savedText.wordCount} words</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{savedText.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Saved {new Date(savedText.createdAt).toLocaleDateString()} at {new Date(savedText.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowLoadModal(false)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}