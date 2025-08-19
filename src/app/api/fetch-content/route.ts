import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LibRead/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch content: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, nav, header, footer, aside, .ad, .advertisement, .social-share').remove();

    const title = $('title').text().trim() || 
                $('h1').first().text().trim() || 
                'Untitled';

    let content = '';
    const paragraphs: string[] = [];

    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      'main',
      '.main-content'
    ];

    let $contentContainer = $('body');
    
    for (const selector of contentSelectors) {
      const $found = $(selector);
      if ($found.length > 0 && $found.text().trim().length > content.length) {
        $contentContainer = $found.first();
        break;
      }
    }

    // First try to get paragraphs specifically
    $contentContainer.find('p').each((_, element) => {
      const text = $(element).text().trim();
      if (text.length > 20 && !text.match(/^(Copyright|©|Terms|Privacy|Subscribe|Share|Like|Follow|Tweet|Facebook)/i)) {
        paragraphs.push(text);
      }
    });

    // If no paragraphs found, try div elements
    if (paragraphs.length === 0) {
      $contentContainer.find('div').each((_, element) => {
        const text = $(element).text().trim();
        if (text.length > 50 && !text.match(/^(Copyright|©|Terms|Privacy|Subscribe|Share|Like)/i)) {
          paragraphs.push(text);
        }
      });
    }

    // Fallback: get all p tags from the entire document
    if (paragraphs.length === 0) {
      $('p').each((_, element) => {
        const text = $(element).text().trim();
        if (text.length > 20) {
          paragraphs.push(text);
        }
      });
    }

    content = paragraphs.join(' ');

    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract meaningful content from the URL' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        title,
        url,
        content,
        paragraphs: paragraphs.filter(p => p.length > 20),
        wordCount: content.split(' ').length,
        estimatedReadTime: Math.ceil(content.split(' ').length / 200)
      }
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to process the URL' },
      { status: 500 }
    );
  }
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}