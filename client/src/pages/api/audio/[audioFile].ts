// import { NextApiRequest, NextApiResponse } from "next";
// import path from "path";
// import fs from "fs";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { audioFile } = req.query;

//   const filePath = path.join(process.cwd(), "src/python", audioFile as string);

//   if (fs.existsSync(filePath)) {
//     res.setHeader("Content-Type", "audio/mpeg");
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } else {
//     res.status(404).json({ error: "Audio file not found" });
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query;

  // Define the path to the audio file in 'api/audio'
  const filePath = path.join(process.cwd(), 'api', 'audio', `${file}`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "audio/mpeg");
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}
