import { spawn } from "child_process";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text_content } = req.body;

  const content = spawn("python3", ["src/python/fetchContent.py"]);

  content.stdin.write(`SPEAK:${text_content}`);
  content.stdin.end();

  let output = "";

  content.stdout.on("data", (data) => {
    output += data.toString();
  });

  content.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  content.on("close", () => {
    if (output) {
      try {
        const { audio_file } = JSON.parse(output);
        const filePath = path.join(process.cwd(), "src/python", audio_file);
        res.status(200).json({ audioPath: `/api/audio/${audio_file}` });
      } catch (error) {
        res.status(500).json({ error: "Failed to parse JSON" });
      }
    } else {
      res.status(500).json({ error: "No output received" });
    }
  });
}
