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
3. **Paragraph Navigation**: Click paragraphs to jump to specific sections
4. **Audio Controls**: Play/pause/stop, speed adjustment, paragraph skipping
5. **Browser Compatibility**: Detects 20+ browsers with specific guidance
6. **Responsive Design**: Works on desktop and mobile devices

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

# Key Files
- @package.json - Dependencies and npm scripts
- @src/app/api/fetch-content/route.ts - Web scraping API endpoint
- @src/hooks/useSpeechSynthesis.ts - Core speech synthesis logic
- @src/components/BrowserCompatibility.tsx - Browser detection logic
- @tailwind.config.js - Tailwind CSS configuration
- @tsconfig.json - TypeScript configuration

# API Endpoints
- `POST /api/fetch-content` - Fetches and parses web content
  - Input: `{ url: string }`
  - Output: `{ title, content, paragraphs, wordCount, estimatedReadTime }`
  - Error handling for invalid URLs and parsing failures

# Styling Guidelines
- Use Tailwind utility classes for consistent design
- Color scheme: Blue primary (blue-600), green for success, orange for warnings
- Responsive breakpoints: sm: (640px), md: (768px), lg: (1024px)
- Professional SaaS-level UI with proper spacing and typography

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