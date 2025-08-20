'use client';

import { FileText, Save, Upload } from 'lucide-react';

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
      const savedTexts = JSON.parse(localStorage.getItem('libread-saved-texts') || '[]');
      const newText = {
        id: Date.now(),
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        content: text,
        createdAt: new Date().toISOString(),
        wordCount,
      };
      savedTexts.unshift(newText);
      // Keep only the 10 most recent
      savedTexts.splice(10);
      localStorage.setItem('libread-saved-texts', JSON.stringify(savedTexts));
      alert('Text saved successfully!');
    }
  };

  const handleLoad = () => {
    const savedTexts = JSON.parse(localStorage.getItem('libread-saved-texts') || '[]');
    if (savedTexts.length === 0) {
      alert('No saved texts found.');
      return;
    }

    const selection = savedTexts.map((t: { title: string; wordCount: number }, i: number) => 
      `${i + 1}. ${t.title} (${t.wordCount} words)`
    ).join('\n');
    
    const choice = prompt(`Select a saved text:\n\n${selection}\n\nEnter the number (1-${savedTexts.length}):`);
    const index = parseInt(choice || '0') - 1;
    
    if (index >= 0 && index < savedTexts.length) {
      onTextChange(savedTexts[index].content);
    }
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
    </div>
  );
}