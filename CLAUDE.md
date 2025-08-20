# LibRead - Multi-Modal Text-to-Speech Platform

A comprehensive Next.js application that provides text-to-speech functionality across multiple input methods: web content, direct text, documents, and specialized novel reading. Built for an immersive audio reading experience with advanced controls and responsive design.

**Current Status**: Web reader and Text reader fully functional. Currently debugging speech synthesis callback/state synchronization issues. Expanding to document and novel readers with modern SaaS landing page design.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Lucide React (icons)
- **Web Scraping**: Cheerio for HTML parsing
- **Speech**: Web Speech API (browser native)
- **Linting**: ESLint with Next.js config

# Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (MUST pass before committing)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (MUST pass before committing)

# Project Structure (Current - Expanding to Multi-Reader Platform)
```
src/
├── app/
│   ├── api/
│   │   ├── fetch-content/     # Web scraping API for URL reader
│   │   └── parse-document/    # PLANNED: Document parsing API
│   ├── web/                  # Web reader (renamed from /reader)
│   ├── text/                 # ✅ COMPLETED: Direct text input reader
│   ├── document/             # PLANNED: Document upload reader  
│   ├── novel/                # PLANNED: Specialized novel reader
│   ├── layout.tsx            # Root layout with enhanced navigation
│   └── page.tsx              # Landing page with reader selection
├── components/
│   ├── shared/               # PLANNED: Shared across all readers
│   │   ├── BrowserCompatibility.tsx  # Browser detection & compatibility
│   │   ├── Footer.tsx               # Site footer
│   │   ├── Navbar.tsx              # Enhanced navigation
│   │   └── TextToSpeechControls.tsx # Universal audio controls
│   ├── web/                  # PLANNED: Web reader specific
│   │   ├── WebInput.tsx             # Web URL input form
│   │   └── ContentDisplay.tsx       # Web content display
│   ├── text/                 # ✅ COMPLETED: Text reader components
│   │   ├── TextInput.tsx           # Text input with word count and save/load
│   │   └── TextDisplay.tsx         # Text content display with clickable paragraphs
│   ├── document/             # PLANNED: Document reader components
│   └── novel/                # PLANNED: Novel reader components
└── hooks/
    ├── useSpeechSynthesis.ts        # Core speech synthesis
    ├── useDocumentParser.ts         # PLANNED: Document parsing
    └── useReadingProgress.ts        # PLANNED: Novel progress tracking
```

# Architecture
- **App Router**: Using Next.js 15 app directory structure
- **Server Components**: Used by default, client components marked with 'use client'
- **API Routes**: RESTful API in app/api/ directory
- **Custom Hooks**: Reusable logic in hooks/ directory
- **Component Composition**: Small, focused, reusable components

# Code Style
- **TypeScript**: Use TypeScript for all files, strict mode enabled
- **Imports**: Use ES modules syntax: `import { Component } from 'library'`
- **Components**: Functional components with TypeScript interfaces for props
- **File Naming**: 
  - Components: PascalCase (TextToSpeechControls.tsx)
  - Hooks: camelCase starting with 'use' (useSpeechSynthesis.ts)
  - API routes: lowercase (route.ts)
- **CSS**: Use Tailwind utility classes, avoid custom CSS unless necessary
- **Icons**: Use Lucide React components

# Key Features (Current & Planned)

## Current Features (Web Reader)
1. **URL Content Fetching**: Scrapes web content using Cheerio, filters out ads/navigation
2. **Text-to-Speech**: Browser Web Speech API with chunking for long content
3. **Paragraph Navigation**: Click paragraphs to jump to specific sections and start playing
4. **Advanced Audio Controls**: 
   - Play/pause/stop with proper state management
   - Speed presets (0.5x, 1x, 1.5x, 2x) plus fine control slider
   - Previous/next paragraph navigation
   - Traffic light status indicators (green/amber/red)
5. **Responsive Design**: 
   - Mobile (< 640px): Collapsible controls with toggle
   - Tablet (640px-1023px): Two-row layout with space-around
   - Desktop (≥ 1024px): Horizontal three-column layout
6. **Browser Compatibility**: Detects 20+ browsers with specific guidance
7. **Real-time Speed Changes**: Speed adjustments apply immediately during playback

## Multi-Reader Platform Progress
1. **✅ Text Reader**: Direct text input with paste functionality, word count, save/load to localStorage
2. **📋 Document Reader**: Upload PDFs, DOCX, TXT files with parsing and preview
3. **✅ Web Reader**: Enhanced current functionality (renamed from /reader)
4. **📋 Novel Reader**: Specialized for novels with chapter navigation and progress tracking
5. **✅ Unified Experience**: Consistent speech controls across all readers
6. **📋 Cross-Reader Features**: Shared settings, bookmarks, reading history

# Development Workflow
- **IMPORTANT**: Always run `npm run build` and `npm run lint` before committing (MUST pass before committing)
- **Testing**: Test speech functionality across different browsers and reader types
- **Commit Regularly**: Commit after completing each feature or significant fix
- Use conventional commit message format with 🤖 Generated footer
- **NEVER** commit sensitive information or API keys
- Test with the example URL: https://www.wuxiabox.com/novel/6987152_1.html
- Follow the expansion plan in @docs/EXPANSION_PLAN.md

# Speech Synthesis Notes
- **Browser Support**: Chrome/Edge (best), Safari (good), Firefox (variable), Brave (blocked by default)
- **Voice Loading**: Voices may load asynchronously, handle gracefully
- **Error Handling**: Skip failed paragraphs, continue with next
- **Performance**: Chunk long text into ~400 character segments
- **User Guidance**: Show browser-specific compatibility messages
- **State Management**: 
  - `hasEverStarted` flag prevents confusing "Stopped" status on fresh load
  - Multiple ref flags prevent race conditions (isPausingRef, isJumpingRef, isStoppingRef, isChangingRateRef)
- **Speed Control**: Real-time speed changes restart current paragraph with new rate
- **Paragraph Jumping**: Always starts playback from clicked paragraph regardless of current state

# Key Files

## Core Platform
- @package.json - Dependencies and npm scripts
- @src/hooks/useSpeechSynthesis.ts - Core speech synthesis logic with advanced state management (⚠️ under debugging)
- @src/components/TextToSpeechControls.tsx - Responsive audio controls with mobile toggle (⚠️ recently fixed)
- @src/components/BrowserCompatibility.tsx - Browser detection logic for 20+ browsers

## Text Reader (✅ Complete)
- @src/app/text/page.tsx - Text reader page with modular architecture
- @src/components/TextInput.tsx - Text input with word count and save/load functionality
- @src/components/TextDisplay.tsx - Text content display with clickable paragraphs

## Web Reader (✅ Complete)  
- @src/app/web/page.tsx - Web reader page (renamed from /reader)
- @src/components/WebInput.tsx - Web URL input form
- @src/components/ContentDisplay.tsx - Web article display with clickable paragraphs
- @src/app/api/fetch-content/route.ts - Web scraping API endpoint

## Navigation & Layout
- @src/app/page.tsx - Modern SaaS landing page with four-reader showcase
- @src/components/Navbar.tsx - Enhanced navigation with four reader types
- @src/components/Footer.tsx - Updated footer with reader links

## Documentation & Config
- @docs/DEBUG_SESSION_PROGRESS.md - Current debugging session status and next steps
- @docs/CLAUDE_MD_BEST_PRACTICES.md - Documentation best practices guide
- @docs/EXPANSION_PLAN.md - Detailed multi-reader implementation strategy
- @tailwind.config.js - Tailwind CSS configuration
- @tsconfig.json - TypeScript configuration

# API Endpoints (Current & Planned)

## Current Endpoints
- `POST /api/fetch-content` - Fetches and parses web content
  - Input: `{ url: string }`
  - Output: `{ title, content, paragraphs, wordCount, estimatedReadTime }`
  - Error handling for invalid URLs and parsing failures

## Planned Endpoints
- `POST /api/parse-document` - Parse uploaded documents
  - Input: FormData with file upload
  - Output: `{ title, content, paragraphs, wordCount, fileType }`
  - Support: PDF, DOCX, TXT, RTF files
- `GET /api/reading-progress/:id` - Retrieve reading progress (for novels)
- `POST /api/reading-progress` - Save reading progress (for novels)

# Styling Guidelines
- Use Tailwind utility classes for consistent design
- Color scheme: Blue primary (blue-600), green for success/playing, amber for paused, red for stopped
- Responsive breakpoints: sm: (640px), md: (768px), lg: (1024px)
- Professional SaaS-level UI with proper spacing and typography
- **Responsive Patterns**:
  - Mobile: Collapsible interface with toggle (ChevronDown/ChevronUp icons)
  - Tablet: Two-row layout with justify-around spacing
  - Desktop: Horizontal three-column layout (Title | Controls | Speed+Status)

# Browser Compatibility Handling
- Detect specific browsers and provide tailored messaging
- Handle Brave browser privacy settings specifically
- Show appropriate icons and colors based on compatibility
- Guide users to compatible browsers when needed

# Expansion Roadmap
See @docs/EXPANSION_PLAN.md for detailed implementation strategy and file structure evolution for the multi-reader platform.

# Do Not Touch
- node_modules/ directory
- .next/ directory (build output)
- Auto-generated files
- Package-lock.json (unless updating dependencies)
- docs/ directory (documentation and planning files)

# Current Debugging Status

## ✅ FIXED Issues
- **Paragraph Indicator Sync**: Fixed visual indicator getting stuck when using Previous/Next navigation after jumping to paragraphs
  - Root cause: `jumpToParagraph` function not receiving `onParagraphChange` callback
  - Solution: Added callback parameter and proper callback passing in TextToSpeechControls
  - Files: `useSpeechSynthesis.ts`, `TextToSpeechControls.tsx`
  - Commit: `029e240` on `debug-text` branch

## 🔍 UNDER INVESTIGATION  
- **Paragraph Click Callback**: Direct paragraph clicking may have same sync issue as Previous/Next (needs testing)
- **Speed Change Sync**: Speed changes during playback might not maintain visual indicator sync
- **Race Conditions**: Rapid navigation clicking during speech synthesis

## 📋 PENDING INVESTIGATION
- Edge case testing: rapid clicking, state changes during speech
- Resume/pause state consistency verification
- Cross-reader callback pattern review

See @docs/DEBUG_SESSION_PROGRESS.md for detailed debugging status and next steps.

# Common Issues
- **No Voices Available**: Usually Brave browser privacy settings or Linux missing espeak
- **Synthesis Failed**: Long paragraphs need chunking, special characters cause issues  
- **CORS Issues**: Web scraping limited by same-origin policy, handle gracefully
- **Speed Changes Not Applying**: Fixed with overrideRate parameter to prevent race conditions
- **Mobile Interface Too Cluttered**: Use toggle to collapse/expand controls as needed

# Recent Improvements
- **Text Reader Implementation**: Complete text reader with modular components, save/load functionality
- **Paragraph Indicator Sync Fix**: Resolved visual indicator sync issues with speech auto-progression  
- **Enhanced Audio Controls**: Added preset speed buttons, traffic light status, improved responsive design
- **Mobile Optimization**: Collapsible interface saves screen space while maintaining functionality  
- **Race Condition Fixes**: Robust state management prevents speech synthesis conflicts
- **Better UX**: Paragraph clicking always starts playback, stop button resets to first paragraph
- **Responsive Design**: Three-tier layout optimized for mobile, tablet, and desktop
- **Modular Architecture**: Separated concerns with TextInput and TextDisplay components