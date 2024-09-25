import { spawn } from "child_process";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  try {
    // Validate the URL
    new URL(url);
    console.log("Received URL:", url);

    // Spawn the Python process, passing the URL as an argument

    const content = spawn("python3", ["src/python/fetchContent.py"]);

    content.stdin.write(url);
    content.stdin.end();

    let output = "";
    
    content.stdout.on("data", (data) => {
      output += data.toString();
    });

    content.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    content.on("close", () => {
      if (output && typeof output === "string") {
        try {
          const parsedOutput = JSON.parse(output);
          console.log("Parsed Output:", parsedOutput);
          res.status(200).json(parsedOutput);
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          res.status(500).json({ error: "Failed to parse JSON from the child process." });
        }
      } else {
        console.error("No output received.");
        res.status(500).json({
          error: "No output received from the child process.",
        });
      }
    });

  } catch (err) {
    res.status(400).json({ error: "Invalid URL" });
  }
}
