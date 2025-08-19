# LibRead Expansion Plan

## Overview
This document outlines the expansion of LibRead from a single URL-based text-to-speech reader into a comprehensive multi-modal reading platform with four distinct reader types.

## Current State (Updated)
- **Web Reader**: Fully functional URL-based web content reader at `/web` (renamed from `/reader`)
- **Modern Landing Page**: SaaS-style homepage showcasing all four planned readers
- **Enhanced Navigation**: Navbar and footer updated for multi-reader platform
- **Core Features**: Web scraping, speech synthesis, responsive design, browser compatibility
- **Recent Improvements**: Navigation button state fixes, URL input text visibility, mobile-friendly controls
- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4

## Planned Expansion

### 1. Text Reader
**Purpose**: Direct text input for immediate speech synthesis
**Features**:
- Large textarea for pasting text content
- Word/character count display
- Text formatting options (optional)
- Same speech controls as current reader
- Save/load text functionality

**Implementation**:
- Route: `/text`
- Component: `TextReader`
- No API needed (client-side only)
- Reuse existing speech synthesis hooks

### 2. Document Reader
**Purpose**: Upload and read documents (.pdf, .txt, .docx, etc.)
**Features**:
- File upload with drag-and-drop
- Document parsing and text extraction
- Preview of extracted content
- Support for multiple file formats
- Document metadata display

**Implementation**:
- Route: `/document`
- Component: `DocumentReader`
- New API: `/api/parse-document`
- Libraries needed: pdf-parse, mammoth (docx), etc.
- File size limits and validation

### 3. Web Reader (Renamed)
**Purpose**: Current URL-based functionality with enhanced branding
**Features**:
- Existing functionality maintained
- Enhanced UI/UX for web-specific features
- Better error handling for web scraping
- Site-specific optimizations

**Implementation**:
- Route: `/web` (redirect from current `/reader`)
- Rename existing components for clarity
- Enhanced web scraping capabilities
- Better mobile responsiveness

### 4. Novel Reader (Specialized)
**Purpose**: Fine-tuned experience for reading novels and long-form content
**Features**:
- Chapter detection and navigation
- Reading progress tracking
- Bookmarks and notes
- Custom voice settings per novel
- Reading speed optimization for narrative
- Enhanced navigation for long content

**Implementation**:
- Route: `/novel`
- Copy of web reader with novel-specific enhancements
- Enhanced content parsing for novel sites
- Additional state management for reading progress
- Custom UI optimized for long-form reading

## Navigation Structure

### Main Navigation
```
LibRead
├── Home (/)
├── Text Reader (/text)
├── Document Reader (/document)
├── Web Reader (/web)
└── Novel Reader (/novel)
```

### Shared Components
- `TextToSpeechControls` (enhanced for different contexts)
- `BrowserCompatibility`
- `Footer` and `Navbar`
- Speech synthesis hooks (enhanced)

### New Components Needed
```
src/
├── components/
│   ├── TextInput.tsx           # Large textarea for text reader
│   ├── DocumentUpload.tsx      # File upload component
│   ├── DocumentPreview.tsx     # Document content preview
│   ├── NovelNavigation.tsx     # Chapter/progress navigation
│   ├── ReadingProgress.tsx     # Progress tracking for novels
│   └── ReaderModeSelector.tsx  # Navigation between readers
├── hooks/
│   ├── useDocumentParser.ts    # Document parsing logic
│   ├── useReadingProgress.ts   # Novel progress tracking
│   └── useNovelOptimization.ts # Novel-specific features
└── app/
    ├── text/                   # Text reader page
    ├── document/               # Document reader page
    ├── web/                    # Renamed web reader
    └── novel/                  # Novel reader page
```

## File Structure Evolution

### Current Structure
```
src/
├── app/
│   ├── api/fetch-content/     # Web scraping API
│   ├── web/                  # Web reader page (renamed from reader)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BrowserCompatibility.tsx
│   ├── ContentDisplay.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── TextToSpeechControls.tsx
│   └── WebInput.tsx
└── hooks/
    └── useSpeechSynthesis.ts
```

### Proposed New Structure
```
src/
├── app/
│   ├── api/
│   │   ├── fetch-content/     # Web scraping API
│   │   └── parse-document/    # NEW: Document parsing API
│   ├── text/                  # NEW: Text reader page
│   │   └── page.tsx
│   ├── document/              # NEW: Document reader page
│   │   └── page.tsx
│   ├── web/                   # RENAMED: Web reader page
│   │   └── page.tsx
│   ├── novel/                 # NEW: Novel reader page
│   │   └── page.tsx
│   ├── layout.tsx             # ENHANCED: Updated navigation
│   └── page.tsx               # ENHANCED: New landing page
├── components/
│   ├── shared/                # NEW: Shared components
│   │   ├── BrowserCompatibility.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── TextToSpeechControls.tsx
│   ├── text/                  # NEW: Text reader components
│   │   ├── TextInput.tsx
│   │   └── TextEditor.tsx
│   ├── document/              # NEW: Document reader components
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentPreview.tsx
│   │   └── FileTypeHandler.tsx
│   ├── web/                   # RENAMED: Web reader components
│   │   ├── WebInput.tsx
│   │   └── ContentDisplay.tsx
│   └── novel/                 # NEW: Novel reader components
│       ├── ChapterNavigation.tsx
│       ├── ReadingProgress.tsx
│       └── NovelContentDisplay.tsx
├── hooks/
│   ├── useSpeechSynthesis.ts  # ENHANCED: Core speech hook
│   ├── useDocumentParser.ts   # NEW: Document parsing
│   ├── useReadingProgress.ts  # NEW: Progress tracking
│   └── useNovelFeatures.ts    # NEW: Novel-specific features
├── lib/                       # NEW: Utility libraries
│   ├── documentParser.ts      # Document parsing utilities
│   ├── novelDetection.ts      # Novel content detection
│   └── progressStorage.ts     # Reading progress storage
└── types/                     # NEW: TypeScript types
    ├── document.ts            # Document-related types
    ├── novel.ts               # Novel-specific types
    └── reader.ts              # Shared reader types
```

## Implementation Strategy

### ✅ Phase 1: Foundation (COMPLETED)
1. ✅ Update navigation structure (navbar, footer, landing page)
2. ✅ Rename current reader to web reader (`/reader` → `/web`)
3. ✅ Create modern SaaS landing page design
4. ✅ Update CLAUDE.md and documentation with new structure
5. ✅ Fix navigation button state synchronization issues
6. ✅ Improve URL input text visibility and mobile responsiveness

### 📋 Phase 2: Text Reader (NEXT)
1. Create text reader page and components (`/text`)
2. Implement large textarea with word/character count
3. Integrate with existing speech synthesis hooks
4. Add text save/load functionality
5. Create text-specific UI optimizations

### 📋 Phase 3: Document Reader
1. Implement document upload API (`/api/parse-document`)
2. Add document parsing libraries (pdf-parse, mammoth)
3. Create document preview components
4. Handle multiple file formats with validation
5. Add drag-and-drop upload interface

### 📋 Phase 4: Novel Reader
1. Copy and enhance web reader functionality
2. Add novel-specific features (chapter detection, progress tracking)
3. Implement reading progress storage
4. Optimize UI for long-form content navigation
5. Add bookmarking and notes functionality

### 📋 Phase 5: Integration & Polish
1. Unify design across all readers
2. Enhance shared components with cross-reader features
3. Add user preferences and settings persistence
4. Performance optimization and testing
5. Final responsive design polish

## Technical Considerations

### Dependencies to Add
```json
{
  "pdf-parse": "^1.1.1",          // PDF parsing
  "mammoth": "^1.6.0",           // DOCX parsing
  "file-type": "^19.0.0",        // File type detection
  "react-dropzone": "^14.2.3"    // File upload UI
}
```

### API Endpoints
- `POST /api/parse-document` - Parse uploaded documents
- `GET /api/reading-progress` - Retrieve reading progress
- `POST /api/reading-progress` - Save reading progress

### Storage Considerations
- Local storage for reading progress
- Session storage for temporary content
- File upload size limits
- Document parsing timeouts

## User Experience Flow

### Landing Page
- Clear navigation to all four reader types
- Example use cases for each reader
- Quick start guides

### Reader-Specific Features
- **Text**: Immediate input and playback
- **Document**: Upload, parse, preview, read
- **Web**: URL input, scrape, optimize, read
- **Novel**: Enhanced navigation, progress tracking

### Cross-Reader Benefits
- Consistent speech controls
- Unified design language
- Shared settings and preferences
- Common keyboard shortcuts

## Future Enhancements

### Advanced Features
- Voice cloning integration
- Multi-language support
- Reading analytics
- Social features (sharing, reviews)
- API for third-party integrations

### Novel Reader Specific
- AI-powered chapter detection
- Character voice assignment
- Reading speed optimization
- Immersive reading modes
- Integration with novel platforms

This expansion transforms LibRead from a single-purpose tool into a comprehensive reading platform while maintaining the core excellence of the speech synthesis functionality.