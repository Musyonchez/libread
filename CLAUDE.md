# LibRead - Web Content Text-to-Speech Reader

A Next.js application that fetches web content from URLs and provides text-to-speech functionality with advanced controls for an immersive audio reading experience.

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

# Project Structure
```
src/
├── app/
│   ├── api/fetch-content/  # API route for web scraping
│   ├── reader/            # Main reader page
│   ├── layout.tsx         # Root layout with navbar/footer
│   └── page.tsx           # Landing page
├── components/
│   ├── BrowserCompatibility.tsx  # Browser detection & compatibility
│   ├── ContentDisplay.tsx        # Article content with paragraphs
│   ├── Footer.tsx               # Site footer
│   ├── Navbar.tsx              # Site navigation
│   ├── TextToSpeechControls.tsx # Audio controls & synthesis
│   └── URLInput.tsx            # URL input form
└── hooks/
    └── useSpeechSynthesis.ts   # Custom hook for speech synthesis
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

# Key Features
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

# Development Workflow
- **IMPORTANT**: Always run `npm run build` and `npm run lint` before committing
- **Testing**: Test speech functionality across different browsers
- Use feature branches for new functionality
- Follow conventional commit message format
- **NEVER** commit sensitive information or API keys
- Test with the example URL: https://www.wuxiabox.com/novel/6987152_1.html

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
- @package.json - Dependencies and npm scripts
- @src/app/api/fetch-content/route.ts - Web scraping API endpoint
- @src/hooks/useSpeechSynthesis.ts - Core speech synthesis logic with advanced state management
- @src/components/TextToSpeechControls.tsx - Responsive audio controls with mobile toggle
- @src/components/BrowserCompatibility.tsx - Browser detection logic for 20+ browsers
- @src/components/ContentDisplay.tsx - Article display with clickable paragraphs
- @docs/CLAUDE_MD_BEST_PRACTICES.md - Documentation best practices guide
- @tailwind.config.js - Tailwind CSS configuration
- @tsconfig.json - TypeScript configuration

# API Endpoints
- `POST /api/fetch-content` - Fetches and parses web content
  - Input: `{ url: string }`
  - Output: `{ title, content, paragraphs, wordCount, estimatedReadTime }`
  - Error handling for invalid URLs and parsing failures

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

# Do Not Touch
- node_modules/ directory
- .next/ directory (build output)
- Auto-generated files
- Package-lock.json (unless updating dependencies)

# Common Issues
- **No Voices Available**: Usually Brave browser privacy settings or Linux missing espeak
- **Synthesis Failed**: Long paragraphs need chunking, special characters cause issues  
- **CORS Issues**: Web scraping limited by same-origin policy, handle gracefully
- **Speed Changes Not Applying**: Fixed with overrideRate parameter to prevent race conditions
- **Paragraph Jumping Issues**: Fixed with multiple ref flags to prevent auto-progression conflicts
- **Mobile Interface Too Cluttered**: Use toggle to collapse/expand controls as needed

# Recent Improvements
- **Enhanced Audio Controls**: Added preset speed buttons, traffic light status, improved responsive design
- **Mobile Optimization**: Collapsible interface saves screen space while maintaining functionality  
- **Race Condition Fixes**: Robust state management prevents speech synthesis conflicts
- **Better UX**: Paragraph clicking always starts playback, stop button resets to first paragraph
- **Responsive Design**: Three-tier layout optimized for mobile, tablet, and desktop