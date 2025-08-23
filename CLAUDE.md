# LibRead - Multi-Modal Text-to-Speech Platform

A comprehensive Next.js application that provides text-to-speech functionality across four specialized readers: text input, document uploads, web content, and novel reading with advanced chapter navigation. Built for an immersive audio reading experience with advanced controls and responsive design.

**Current Status**: ✅ ALL 4 READERS PRODUCTION-READY! Complete multi-reader platform with Text, Document, Web, and Novel readers. Advanced speech synthesis, localStorage management, wuxiabox navigation, PDF/DOCX parsing, modern UI components, and robust error handling across all readers.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Lucide React (icons)
- **Web Scraping**: Cheerio for HTML parsing
- **Document Parsing**: pdf-parse (PDF), mammoth (DOCX), file-type (validation)
- **Speech**: Web Speech API (browser native)
- **Linting**: ESLint with Next.js config

# Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (MUST pass before committing)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (MUST pass before committing)

# Project Structure (Complete Multi-Reader Platform)
```
src/
├── app/
│   ├── api/
│   │   ├── fetch-content/     # ✅ Web scraping API for URL reader
│   │   └── parse-document/    # ✅ Document parsing API (PDF, DOCX, TXT)
│   ├── web/                  # ✅ Web reader with smart content parsing
│   ├── text/                 # ✅ Direct text input reader with save/load
│   ├── document/             # ✅ Document upload reader with drag & drop
│   ├── novel/                # ✅ Specialized novel reader with chapter navigation
│   ├── layout.tsx            # Root layout with enhanced navigation
│   └── page.tsx              # Modern landing page showcasing all 4 readers
├── components/
│   ├── BrowserCompatibility.tsx    # ✅ Browser detection & compatibility (20+ browsers)
│   ├── Footer.tsx                  # ✅ Clean footer with reader links only
│   ├── Navbar.tsx                  # ✅ Modern navbar with icons and NEW badges
│   ├── TextToSpeechControls.tsx    # ✅ Universal audio controls with responsive design
│   ├── TextInput.tsx               # ✅ Advanced text input with localStorage & modals
│   ├── TextDisplay.tsx             # ✅ Text display with clickable paragraphs
│   ├── WebInput.tsx                # ✅ Web URL input with examples
│   ├── ContentDisplay.tsx          # ✅ Web content display with metadata
│   ├── DocumentUpload.tsx          # ✅ Drag & drop file upload with validation
│   ├── NovelInput.tsx              # ✅ Novel URL input with wuxiabox examples
│   ├── NovelContentDisplay.tsx     # ✅ Novel display with chapter indicators
│   ├── ChapterNavigation.tsx       # ✅ Advanced chapter controls with wuxiabox support
│   ├── BottomChapterNavigation.tsx # ✅ Bottom navigation matching top behavior
│   └── ReadingProgress.tsx         # ✅ Reading progress component (unused in final)
└── hooks/
    └── useSpeechSynthesis.ts        # ✅ Bulletproof speech synthesis with callbacks
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

# Key Features (All Production Ready)

## Universal Features (All Readers)
1. **Advanced Speech Synthesis**: Browser Web Speech API with bulletproof callback system
2. **Universal Audio Controls**: 
   - Play/pause/stop with proper state management
   - Speed presets (0.5x, 1x, 1.5x, 2x) plus fine control slider
   - Previous/next paragraph navigation with 20ms delay prevention
   - Traffic light status indicators (green/amber/red)
   - Real-time speed changes during playback
3. **Responsive Design**: 
   - Mobile (< 640px): Collapsible controls with toggle
   - Tablet (640px-1023px): Two-row layout with space-around
   - Desktop (≥ 1024px): Horizontal three-column layout
4. **Browser Compatibility**: Detects 20+ browsers with specific guidance and fallbacks
5. **Accessibility**: Keyboard shortcuts (spacebar), screen reader support, high contrast

## Reader-Specific Features
1. **✅ Text Reader**: Advanced localStorage with modal UI, save/load/delete, professional UX
2. **✅ Document Reader**: Drag & drop upload, PDF/DOCX/TXT parsing, 10MB limit, validation
3. **✅ Web Reader**: Smart content parsing with Cheerio, ad filtering, metadata extraction
4. **✅ Novel Reader**: 
   - Wuxiabox URL pattern detection (1.html → 2.html → 76.html)
   - Server-side chapter fetching for supported sites
   - Advanced chapter navigation with jump-to functionality
   - Chapter detection algorithms for various novel formats
5. **✅ Cross-Platform**: Modern SaaS-level UI, responsive design, production-grade error handling

# Development Workflow

## Build & Quality Checks
**IMPORTANT**: Before any commit, you MUST run:
```bash
npm run build  # Must pass - no TypeScript errors
npm run lint   # Must pass - no ESLint warnings  
```

## Testing Requirements
- **Speech Functionality**: Test across Chrome, Firefox, Safari, Edge
- **Responsive Design**: Test mobile, tablet, desktop layouts across all 4 readers
- **Reader Types**: Test `/text`, `/document`, `/web`, and `/novel` readers
- **Edge Cases**: Test rapid clicking, speed changes, pause/resume, file uploads
- **Wuxiabox Navigation**: Test chapter jumping and server fetching
- **Example URLs**: 
  - Wuxiabox: https://www.wuxiabox.com/novel/6987152_1.html
  - Web articles: Any blog post or news article
  - Documents: PDF, DOCX, TXT files up to 10MB

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

# API Endpoints (All Production Ready)

## Current Endpoints
- `POST /api/fetch-content` - ✅ Fetches and parses web content
  - Input: `{ url: string }`
  - Output: `{ title, content, paragraphs, wordCount, estimatedReadTime }`
  - Error handling for invalid URLs and parsing failures
  - Advanced content filtering and cleaning

- `POST /api/parse-document` - ✅ Parse uploaded documents
  - Input: FormData with file upload
  - Output: `{ title, content, paragraphs, wordCount, fileType }`
  - Support: PDF, DOCX, TXT files (10MB limit)
  - Comprehensive file validation and error handling
  - Dynamic require() to avoid build issues

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

# Platform Completion Status

## ✅ ALL 4 READERS COMPLETED
1. **Text Reader**: Advanced localStorage, modal UI, save/load/delete functionality
2. **Document Reader**: PDF/DOCX/TXT parsing, drag & drop upload, 10MB limit, validation
3. **Web Reader**: Smart content parsing, ad filtering, metadata extraction, error handling
4. **Novel Reader**: Wuxiabox navigation, chapter detection, server fetching, advanced controls

## Core Platform Achievements
- **✅ Bulletproof Speech Synthesis**: Comprehensive callback synchronization, race condition prevention
- **✅ Universal Audio Controls**: Consistent across all 4 readers with responsive design
- **✅ Modern SaaS UI**: Professional modals, toast notifications, hover interactions
- **✅ Cross-Platform Compatibility**: Mobile-first design, 20+ browser support, accessibility

## Technical Excellence
- **Production-Grade Architecture**: TypeScript strict mode, ESLint compliance, Next.js 15
- **Advanced State Management**: Visual state consistency, race condition prevention
- **Professional UX**: No browser alerts/prompts, smooth animations, keyboard shortcuts
- **Robust Error Handling**: Graceful failures, comprehensive validation, defensive programming