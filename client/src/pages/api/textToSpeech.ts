import { spawn } from "child_process";
import { log } from "console";
import { NextApiRequest, NextApiResponse } from "next";

const audioCache = new Map<string, Buffer>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text_content } = req.body;
  console.log("text_content from text to speech", text_content)

  if (audioCache.has(text_content)) {
    // Serve from cache if available
    const cachedAudio = audioCache.get(text_content);
    res.setHeader("Content-Type", "audio/mpeg");
    return res.end(cachedAudio);
  }

  const content = spawn("python3", ["src/python/convertAudio.py"]);

  content.stdin.write(`SPEAK:${text_content}`);
  content.stdin.end();

  res.setHeader("Content-Type", "audio/mpeg");

  let audioChunks: Buffer[] = [];

  content.stdout.on("data", (data: Buffer) => {
    audioChunks.push(data); // Collect audio chunks
    res.write(data); // Stream audio to client
  });

  content.on("close", () => {
    const completeAudio = Buffer.concat(audioChunks);
    audioCache.set(text_content, completeAudio); // Cache the full audio
    res.end();
  });
}