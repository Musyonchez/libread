import { spawn } from "child_process";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  try {
    // Validate URL
    new URL(url);
    console.log("Received URL:", url);

    const content = spawn("python3", ["src/python/fetchContent.py"]);

    content.stdin.write(`FETCH:${url}`);
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
          const parsedOutput = JSON.parse(output);
          res.status(200).json(parsedOutput);
        } catch (error) {
          res.status(500).json({ error: "Failed to parse JSON from the child process." });
        }
      } else {
        res.status(500).json({ error: "No output received from the child process." });
      }
    });

  } catch (err) {
    res.status(400).json({ error: "Invalid URL" });
  }
}
