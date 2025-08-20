# LibRead - Multi-Modal Text-to-Speech Platform

A comprehensive Next.js application that provides text-to-speech functionality across multiple input methods: web content, direct text, documents, and specialized novel reading. Built for an immersive audio reading experience with advanced controls and responsive design.

**Current Status**: ✅ Text Reader and Web Reader production-ready with comprehensive features. Advanced speech synthesis, localStorage management, modern UI components, and robust error handling. Document and Novel readers planned for future expansion.

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
1. **✅ Text Reader**: Complete with advanced localStorage management, modal UI, delete functionality, and professional UX
2. **📋 Document Reader**: Upload PDFs, DOCX, TXT files with parsing and preview
3. **✅ Web Reader**: Enhanced functionality with robust web scraping and content parsing
4. **📋 Novel Reader**: Specialized for novels with chapter navigation and progress tracking
5. **✅ Unified Experience**: Bulletproof speech controls with comprehensive callback synchronization
6. **📋 Cross-Reader Features**: Shared settings, bookmarks, reading history

# Development Workflow

## Build & Quality Checks
**IMPORTANT**: Before any commit, you MUST run:
```bash
npm run build  # Must pass - no TypeScript errors
npm run lint   # Must pass - no ESLint warnings  
```

## Testing Requirements
- **Speech Functionality**: Test across Chrome, Firefox, Safari
- **Responsive Design**: Test mobile, tablet, desktop layouts
- **Reader Types**: Test both `/text` and `/web` readers
- **Edge Cases**: Test rapid clicking, speed changes, pause/resume
- **Example URL**: https://www.wuxiabox.com/novel/6987152_1.html

## Commit Standards
- Use conventional commit format with descriptive messages
- **ALWAYS** include the footer:
  ```
  🤖 Generated with [Claude Code](https://claude.ai/code)
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```
- **NEVER** commit sensitive information, API keys, or credentials
- Commit after completing each logical feature or bug fix

## Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Speech synthesis callback patterns followed
- [ ] Responsive design works on all breakpoints  
- [ ] Browser compatibility maintained
- [ ] Error handling implemented

# Critical Architecture Patterns

## Speech Synthesis Callback Pattern
**YOU MUST** follow this pattern for all speech functions:
```typescript
// Always accept optional callback parameter with fallback
const someFunction = (param: any, onParagraphChange?: (index: number) => void) => {
  const callbackToUse = onParagraphChange || onParagraphChangeRef.current || undefined;
  speak(content, startIndex, callbackToUse);
};
```

## State Management Rules
**IMPORTANT**: Use visual state for navigation calculations:
```typescript
// ✅ CORRECT - Use currentParagraph (visual state)
const nextIndex = currentParagraph + 1;

// ❌ WRONG - Don't use speechState.currentParagraph (only updates when speech starts)  
const nextIndex = speechState.currentParagraph + 1;
```

## Race Condition Prevention
**YOU MUST** use these ref flags to prevent speech conflicts:
- `isPausingRef` - Set when pausing to prevent auto-progression
- `isJumpingRef` - Set when jumping to prevent auto-progression  
- `isStoppingRef` - Set when stopping to prevent auto-progression
- `isChangingRateRef` - Set when changing speed to prevent auto-progression

## Component Composition Guidelines
- Keep components small and focused (single responsibility)
- Display components only handle UI, delegate logic to parent handlers
- Speech controls accept callbacks from parent components
- Use TypeScript interfaces for all props and event handlers

## Text Reader Advanced Features
**localStorage Pattern** - Follow this structure for saved content:
```typescript
interface SavedText {
  id: number;
  title: string;        // First 50 chars + "..." if longer
  content: string;      // Full text content
  createdAt: string;    // ISO timestamp
  wordCount: number;    // Word count for display
}
```

**Modal UI Standards**:
- Use fixed positioning with backdrop blur for overlays
- Include proper close buttons (X icon) and ESC key support
- Show loading/empty states with appropriate icons
- Use hover effects for interactive elements (opacity transitions)
- Always prevent event bubbling for nested clickable elements

# Key Files

## Core Speech System ⚠️ CRITICAL 
- @src/hooks/useSpeechSynthesis.ts - **Core speech logic - follow callback patterns strictly**
- @src/components/TextToSpeechControls.tsx - **Audio controls - all setRate/resume calls must pass callbacks**
- @src/components/BrowserCompatibility.tsx - Browser detection for 20+ browsers

## Production-Ready Readers ✅
**Text Reader** (`/text`) - **COMPLETE WITH ADVANCED FEATURES**:
- @src/app/text/page.tsx - Fully integrated page with callback synchronization
- @src/components/TextInput.tsx - **Advanced localStorage with modal UI, save/load/delete functionality**
- @src/components/TextDisplay.tsx - Clickable paragraphs with proper visual feedback

**Web Reader** (`/web`) - **PRODUCTION READY**:
- @src/app/web/page.tsx - Robust page with comprehensive error handling
- @src/components/WebInput.tsx - URL input with example and validation
- @src/components/ContentDisplay.tsx - Professional content display with metadata
- @src/app/api/fetch-content/route.ts - Advanced web scraping API with Cheerio parsing

## Platform Foundation
- @src/app/page.tsx - Modern SaaS landing page
- @src/components/Navbar.tsx - Navigation for four reader types
- @src/components/Footer.tsx - Footer with reader links
- @package.json - Dependencies and npm scripts

## Configuration & Docs
- @tailwind.config.js - Tailwind CSS 4 configuration  
- @tsconfig.json - TypeScript strict mode configuration
- @docs/EXPANSION_PLAN.md - Future Document/Novel reader implementation plan
- @docs/CLAUDE_MD_BEST_PRACTICES.md - Documentation standards and guidelines

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

# Debugging Status - COMPLETED ✅

## ✅ ALL ISSUES RESOLVED
**Major Callback Synchronization Fixes:**
- **Paragraph Click Sync**: Fixed missing callbacks in paragraph click handlers for both readers
- **Speed Change Sync**: Fixed setRate function to accept and use callback parameter properly  
- **Resume Sync**: Fixed resume function callback synchronization
- **Navigation Race Conditions**: Fixed rapid clicking using visual state instead of speech state
- **TypeScript Consistency**: Updated all function signatures to match callback parameters

## ✅ TESTING COMPLETED
**All test scenarios passed:**
- Paragraph click indicator sync works correctly
- Speed changes maintain visual sync during playback
- Pause/resume maintains sync and position  
- Rapid navigation advances properly through content
- Mixed operations handle gracefully without conflicts
- Browser compatibility detection functions properly

**Performance Improvements:**
- Reduced navigation delay from 50ms to 20ms for better responsiveness
- Comprehensive race condition prevention with flag system
- Bulletproof state synchronization across all speech functions

The speech synthesis system is now production-ready with robust error handling and state management.

# Troubleshooting

## Speech Synthesis Issues
- **No Voices Available**: Usually Brave browser privacy settings or Linux missing espeak
- **Synthesis Failed**: Long paragraphs need chunking, special characters cause issues  
- **CORS Issues**: Web scraping limited by same-origin policy, handle gracefully

## UI/UX Issues  
- **Mobile Interface Too Cluttered**: Use toggle to collapse/expand controls as needed
- **Buttons Feel Unresponsive**: 20ms delay is intentional to prevent race conditions

## Fixed Issues (No Longer Problems)
- ~~Speed Changes Not Applying~~ - ✅ Fixed with callback parameter system
- ~~Paragraph Indicator Sync~~ - ✅ Fixed with comprehensive callback synchronization
- ~~Rapid Navigation Breaking~~ - ✅ Fixed by using visual state for calculations

# Recent Major Improvements

## Core Platform Enhancements
- **✅ Advanced Text Reader**: Complete with modal UI, localStorage CRUD operations, professional UX design
- **✅ Bulletproof Speech Synthesis**: Comprehensive callback synchronization, race condition prevention, robust error handling
- **✅ Modern UI Components**: Professional modals, toast notifications, hover interactions, responsive design
- **✅ Keyboard Accessibility**: Smart spacebar handling that respects text input focus, proper keyboard shortcuts

## UI/UX Improvements  
- **Professional Storage Management**: Modal-based save/load system with delete functionality, no more browser alerts/prompts
- **Enhanced Audio Controls**: Preset speed buttons, traffic light status, smart keyboard shortcuts
- **Mobile-First Design**: Collapsible interface, three-tier responsive layouts, touch-friendly interactions
- **Advanced Navigation**: Robust Previous/Next buttons, clickable paragraphs, intelligent state management
- **Browser Compatibility**: Comprehensive detection for 20+ browsers with tailored user guidance

## Technical Architecture
- **Production-Grade Components**: Modal systems, toast notifications, proper event handling with TypeScript
- **Advanced State Management**: Bulletproof callback synchronization, race condition prevention, visual state consistency
- **Professional UX Patterns**: No browser alerts/prompts, smooth animations, hover interactions, accessibility support
- **Robust Error Handling**: Graceful failures, comprehensive browser compatibility, defensive programming practices