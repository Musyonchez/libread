import { spawn } from "child_process";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text_content } = req.body;

  const content = spawn("python3", ["src/python/convertAudio.py"]);

  // Send text content to Python script
  content.stdin.write(`SPEAK:${text_content}`);
  content.stdin.end();

  // Set headers for streaming audio
  res.setHeader("Content-Type", "audio/mpeg");

  // Stream the output from Python back to the client
  content.stdout.on("data", (data) => {
    res.write(data);  // Stream audio chunks as they come
  });

  content.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  content.on("close", () => {
    res.end();  // End the response when done
  });
}
