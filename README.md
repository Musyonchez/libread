# LibRead - Multi-Modal Text-to-Speech Platform

A comprehensive Next.js application that transforms any content into immersive audio experiences. LibRead provides four specialized readers for different content types: text input, document uploads, web content, and novels with advanced chapter navigation.

![LibRead Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Readers](https://img.shields.io/badge/Readers-4%20Complete-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black)

## 🎯 Features

### Universal Features (All Readers)
- **Advanced Speech Synthesis** - Browser Web Speech API with bulletproof callback system
- **Universal Audio Controls** - Play/pause/stop, speed presets (0.5x-2x), paragraph navigation
- **Responsive Design** - Mobile-first with collapsible controls, tablet two-row, desktop three-column
- **Browser Compatibility** - Detects 20+ browsers with specific guidance and fallbacks
- **Accessibility** - Keyboard shortcuts (spacebar), screen reader support, high contrast

### 📝 Text Reader
- Direct text input with instant audio conversion
- Advanced localStorage with modal UI for save/load/delete
- Word count, character count, and estimated read time
- Professional UX with no browser alerts/prompts

### 📄 Document Reader  
- Drag & drop file upload with validation
- PDF, DOCX, and TXT support (10MB limit)
- Real-time file parsing and preview
- Comprehensive error handling and file type detection

### 🌐 Web Reader
- Smart content parsing with Cheerio
- Automatic ad filtering and content extraction
- Metadata display with word count and read time
- Robust error handling for various website structures

### 📚 Novel Reader
- **Wuxiabox Navigation** - Specialized URL pattern handling (1.html → 2.html → 76.html)
- **Server-side Fetching** - Loads new chapters dynamically
- **Advanced Chapter Controls** - Jump-to functionality, next/prev navigation
- **Chapter Detection** - Automatic detection for various novel formats

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Musyonchez/libread.git
cd libread

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access LibRead.

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production (must pass)
npm run start    # Start production server  
npm run lint     # Run ESLint (must pass)
```

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with responsive utilities
- **Icons**: Lucide React for consistent iconography
- **Document Parsing**: pdf-parse (PDF), mammoth (DOCX), file-type (validation)
- **Web Scraping**: Cheerio for HTML parsing and content extraction
- **Speech**: Browser Web Speech API with advanced controls

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── fetch-content/     # Web scraping API
│   │   └── parse-document/    # Document parsing API
│   ├── text/                  # Text reader page
│   ├── document/              # Document reader page  
│   ├── web/                   # Web reader page
│   ├── novel/                 # Novel reader page
│   ├── layout.tsx             # Root layout with navigation
│   └── page.tsx               # Landing page
├── components/
│   ├── TextToSpeechControls.tsx    # Universal audio controls
│   ├── BrowserCompatibility.tsx    # Browser detection
│   ├── [Reader]Input.tsx           # Reader-specific inputs
│   ├── [Reader]Display.tsx         # Reader-specific displays
│   └── ChapterNavigation.tsx       # Novel chapter controls
└── hooks/
    └── useSpeechSynthesis.ts        # Core speech logic
```

## 🎧 Usage Examples

### Text Reader
1. Navigate to `/text`
2. Paste any text content
3. Use audio controls for playback
4. Save frequently used text for later

### Document Reader
1. Navigate to `/document`  
2. Drag & drop PDF, DOCX, or TXT files
3. Review extracted content
4. Start audio playback

### Web Reader
1. Navigate to `/web`
2. Enter any article or blog URL
3. Content is automatically parsed and cleaned
4. Listen with advanced audio controls

### Novel Reader
1. Navigate to `/novel`
2. Enter novel URL (optimized for wuxiabox.com)
3. Use chapter navigation to jump between sections
4. Advanced controls for chapter-by-chapter reading

## 🔧 Configuration

### Browser Compatibility
LibRead automatically detects your browser and provides specific guidance:
- ✅ **Recommended**: Chrome, Edge, Safari (desktop), Firefox
- ⚠️ **Limited**: Brave (privacy settings), Mobile Safari, Firefox (Linux)  
- ❌ **Unsupported**: Internet Explorer, Tor Browser

### Speech Settings
- Speed range: 0.5x to 2.0x with real-time adjustments
- Automatic voice selection with English preference
- Chunking for long content to prevent synthesis issues

## 🚀 Deployment

### Build Requirements
```bash
npm run build    # Must pass - TypeScript strict mode
npm run lint     # Must pass - ESLint compliance
```

### Environment Support
- **Development**: `npm run dev` with hot reload
- **Production**: `npm run build && npm run start`
- **Static Export**: Compatible with static hosting platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code style
4. Run tests: `npm run build && npm run lint`
5. Commit with conventional format
6. Push and create a Pull Request

### Code Standards
- TypeScript strict mode compliance
- ESLint with Next.js configuration  
- Tailwind CSS for styling (no custom CSS)
- Responsive design for all components
- Comprehensive error handling

## 📊 Testing

### Manual Testing Checklist
- [ ] Speech functionality across Chrome, Firefox, Safari, Edge
- [ ] Responsive design on mobile, tablet, desktop  
- [ ] All 4 readers function correctly
- [ ] File upload validation and limits
- [ ] Wuxiabox chapter navigation
- [ ] Edge cases: rapid clicking, speed changes, pause/resume

### Example Content
- **Text**: Any article, essay, or text content
- **Documents**: PDF reports, Word documents, text files (≤10MB)
- **Web**: Blog posts, news articles, documentation
- **Novels**: Wuxiabox URLs like `https://www.wuxiabox.com/novel/6987152_1.html`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Vercel for deployment platform
- Lucide for beautiful icons
- Open source community for document parsing libraries

---

**LibRead** - Transform any content into audio experiences. Built with ❤️ using Next.js and TypeScript.