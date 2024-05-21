#!/usr/bin/env python3
import argparse
import logging
import os
from pytube import YouTube

# Setup logging
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="Download a YouTube video.")
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument("-o", "--output", help="Output file path")
    parser.add_argument("-q", "--quality", help="Video quality (e.g., 720p, 1080p)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose mode")
    args = parser.parse_args()

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)

    youtube = YouTube(args.url)
    if args.quality:
        stream = youtube.streams.filter(res=args.quality).first()
    else:
        stream = youtube.streams.first()

    if not args.output:
        args.output = os.path.basename(youtube.watch_url)

    stream.download(output_path=os.path.dirname(args.output))

if __name__ == "__main__":
    main()
