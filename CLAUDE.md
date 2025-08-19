# LibRead - Web Content Text-to-Speech Reader

## Implementation Plan

### Overview
A Next.js application that fetches web content from URLs and provides text-to-speech functionality with advanced controls.

### Features
- URL input to fetch web content
- Text-to-speech with play/pause/stop controls
- Speed/rate adjustment
- Paragraph-level navigation and reading
- Click-to-read individual paragraphs
- Progress tracking

### Tech Stack
- Next.js 14 (App Router)
- React
- Web Speech API (SpeechSynthesis)
- Cheerio for HTML parsing
- Tailwind CSS for styling

### Implementation Steps

#### 1. Project Setup
- Initialize Next.js project with TypeScript
- Install dependencies: cheerio, @types/node
- Configure Tailwind CSS

#### 2. API Routes
- `/api/fetch-content` - Fetches and parses web content
  - Uses fetch to get HTML content
  - Cheerio to extract text content
  - Returns structured data with paragraphs

#### 3. Components
- `URLInput` - Input field for URL entry
- `TextToSpeechControls` - Play, pause, stop, rate controls
- `ContentDisplay` - Shows fetched content with clickable paragraphs
- `ProgressIndicator` - Shows current reading position

#### 4. Core Functionality
- Web Speech API integration
- State management for speech synthesis
- Paragraph tracking and highlighting
- Error handling for unsupported browsers

#### 5. Features Implementation
- Auto-scroll to current paragraph
- Keyboard shortcuts (spacebar for play/pause)
- Persistent settings (speech rate, voice selection)
- Responsive design

### File Structure
```
src/
├── app/
│   ├── page.tsx                 # Main page
│   ├── layout.tsx              # Root layout
│   └── api/
│       └── fetch-content/
│           └── route.ts        # API route for content fetching
├── components/
│   ├── URLInput.tsx
│   ├── TextToSpeechControls.tsx
│   ├── ContentDisplay.tsx
│   └── ProgressIndicator.tsx
├── hooks/
│   └── useSpeechSynthesis.ts   # Custom hook for TTS
└── types/
    └── index.ts                # Type definitions
```

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter