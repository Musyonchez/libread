'use client';

import { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
  acceptedFormats?: string[];
}

export default function DocumentUpload({ 
  onUpload, 
  disabled = false,
  acceptedFormats = ['.pdf', '.docx', '.txt', '.md', '.rtf']
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB`;
    }

    // Check file type
    const extension = file.name.toLowerCase().split('.').pop();
    const validExtensions = acceptedFormats.map(format => format.replace('.', ''));
    
    if (!extension || !validExtensions.includes(extension)) {
      return `Unsupported file type. Supported formats: ${acceptedFormats.join(', ')}`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    setUploadError(null);
    
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const error = validateFile(file);
    
    if (error) {
      setUploadError(error);
      return;
    }

    onUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : uploadError
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-4">
          {uploadError ? (
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          ) : dragActive ? (
            <CheckCircle className="h-12 w-12 text-blue-500 mx-auto" />
          ) : (
            <div className="relative">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <File className="h-6 w-6 text-gray-500 absolute -bottom-1 -right-1" />
            </div>
          )}

          <div>
            {uploadError ? (
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Upload Error</h3>
                <p className="text-red-600">{uploadError}</p>
              </div>
            ) : dragActive ? (
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Drop your file here</h3>
                <p className="text-blue-600">Release to upload your document</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Document</h3>
                <p className="text-gray-600 mb-4">
                  {disabled ? 'Processing...' : 'Drag and drop your file here, or click to browse'}
                </p>
                <div className="text-sm text-gray-500">
                  <p>Supported formats: {acceptedFormats.join(', ')}</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            )}
          </div>

          {!disabled && !uploadError && (
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={handleClick}
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setUploadError(null)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear Error
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Sample Files to Try</h4>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">📄 Research papers (PDF)</span>
          <span className="bg-gray-100 px-2 py-1 rounded">📝 Word documents (DOCX)</span>
          <span className="bg-gray-100 px-2 py-1 rounded">📋 Text files (TXT)</span>
          <span className="bg-gray-100 px-2 py-1 rounded">📖 Markdown files (MD)</span>
        </div>
      </div>
    </div>
  );
}