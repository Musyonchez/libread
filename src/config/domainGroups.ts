// Domain-based navigation configuration for novel readers
// This file manages different URL patterns and navigation behaviors for various novel sites

export interface NavigationPattern {
  id: string;
  name: string;
  description: string;
  domains: string[];
  urlPattern: RegExp;
  generateUrl: (novelId: string, chapterNum: number) => string;
  extractChapterInfo: (url: string) => { novelId: string; chapterNum: number } | null;
  minChapter?: number;
  maxChapter?: number;
}

// Navigation pattern groups
export const NAVIGATION_PATTERNS: NavigationPattern[] = [
  {
    id: 'wuxia_standard',
    name: 'Wuxia Standard Pattern',
    description: 'Sites using /novel/ID_CHAPTER.html format',
    domains: [
      'wuxiabox.com',
      'wuxiaspot.com', 
      'fanmtl.com'
    ],
    urlPattern: /\/novel\/([^_]+)_(\d+)\.html$/,
    generateUrl: (novelId: string, chapterNum: number) => {
      const domain = getCurrentDomain();
      return `https://www.${domain}/novel/${novelId}_${chapterNum}.html`;
    },
    extractChapterInfo: (url: string) => {
      const match = url.match(/\/novel\/([^_]+)_(\d+)\.html$/);
      if (match) {
        return {
          novelId: match[1],
          chapterNum: parseInt(match[2])
        };
      }
      return null;
    },
    minChapter: 1,
    maxChapter: 999
  },
  
  // Future pattern example - can be added later
  {
    id: 'novel_full',
    name: 'NovelFull Pattern',
    description: 'Sites using /novel/title/chapter-NUMBER format',
    domains: [
      'novelfull.com',
      'readnovelfull.com'
    ],
    urlPattern: /\/novel\/([^\/]+)\/chapter-(\d+)/,
    generateUrl: (novelId: string, chapterNum: number) => {
      const domain = getCurrentDomain();
      return `https://${domain}/novel/${novelId}/chapter-${chapterNum}`;
    },
    extractChapterInfo: (url: string) => {
      const match = url.match(/\/novel\/([^\/]+)\/chapter-(\d+)/);
      if (match) {
        return {
          novelId: match[1],
          chapterNum: parseInt(match[2])
        };
      }
      return null;
    },
    minChapter: 1,
    maxChapter: 9999
  }
];

// Helper function to get current domain from URL (used in generateUrl)
function getCurrentDomain(): string {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.hostname;
  }
  // Fallback for server-side or when window is not available
  return 'wuxiabox.com';
}

// Utility functions
export function findPatternByUrl(url: string): NavigationPattern | null {
  for (const pattern of NAVIGATION_PATTERNS) {
    // Check if URL matches the domain and pattern
    const matchesDomain = pattern.domains.some(domain => url.includes(domain));
    const matchesPattern = pattern.urlPattern.test(url);
    
    if (matchesDomain && matchesPattern) {
      return pattern;
    }
  }
  return null;
}

export function findPatternByDomain(domain: string): NavigationPattern | null {
  for (const pattern of NAVIGATION_PATTERNS) {
    if (pattern.domains.some(patternDomain => domain.includes(patternDomain))) {
      return pattern;
    }
  }
  return null;
}

export function getSupportedDomains(): string[] {
  return NAVIGATION_PATTERNS.flatMap(pattern => pattern.domains);
}

export function isDomainSupported(url: string): boolean {
  return findPatternByUrl(url) !== null;
}

export function getPatternInfo(url: string): {
  pattern: NavigationPattern;
  chapterInfo: { novelId: string; chapterNum: number };
} | null {
  const pattern = findPatternByUrl(url);
  if (!pattern) return null;
  
  const chapterInfo = pattern.extractChapterInfo(url);
  if (!chapterInfo) return null;
  
  return { pattern, chapterInfo };
}

// Export for easy management
export default NAVIGATION_PATTERNS;