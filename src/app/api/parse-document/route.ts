import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import fileType from 'file-type';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds limit. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Detect file type
    const detectedType = await fileType.fromBuffer(buffer);
    const mimeType = detectedType?.mime || file.type;
    const extension = file.name.split('.').pop()?.toLowerCase();

    let content = '';
    const title = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension

    // Parse based on file type
    if (mimeType === 'application/pdf' || extension === 'pdf') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        content = pdfData.text;
      } catch {
        return NextResponse.json({ 
          error: 'Failed to parse PDF file. The file may be corrupted or password-protected.' 
        }, { status: 422 });
      }
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;
      } catch {
        return NextResponse.json({ 
          error: 'Failed to parse DOCX file. The file may be corrupted.' 
        }, { status: 422 });
      }
    } else if (mimeType?.startsWith('text/') || ['txt', 'md', 'rtf'].includes(extension || '')) {
      try {
        content = buffer.toString('utf-8');
      } catch {
        return NextResponse.json({ 
          error: 'Failed to read text file. Please ensure the file is in UTF-8 encoding.' 
        }, { status: 422 });
      }
    } else {
      return NextResponse.json({ 
        error: `Unsupported file type: ${mimeType || 'unknown'}. Supported formats: PDF, DOCX, TXT, MD, RTF` 
      }, { status: 415 });
    }

    // Clean and validate content
    content = content.trim();
    
    if (!content || content.length < 50) {
      return NextResponse.json({ 
        error: 'Could not extract meaningful text from the document' 
      }, { status: 422 });
    }

    // Split content into paragraphs
    const paragraphs = content
      .split(/\n\s*\n/)
      .map(p => p.replace(/\s+/g, ' ').trim())
      .filter(p => p.length > 20);

    // Calculate metadata
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const estimatedReadTime = Math.ceil(wordCount / 200);
    const fileSize = (file.size / 1024).toFixed(1); // Size in KB

    return NextResponse.json({
      success: true,
      data: {
        title,
        content,
        paragraphs: paragraphs.length > 0 ? paragraphs : [content],
        wordCount,
        estimatedReadTime,
        fileType: mimeType || `text/${extension}`,
        fileSize: `${fileSize} KB`,
        fileName: file.name
      }
    });

  } catch (error) {
    console.error('Error parsing document:', error);
    return NextResponse.json(
      { error: 'Failed to process the document' },
      { status: 500 }
    );
  }
}