// pages/api/fetch-content.ts
import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Fetch webpage content
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML and extract text content
    const $ = cheerio.load(html);

    // Remove script tags, style tags, and other non-content elements
    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("header").remove();
    $("footer").remove();
    $(".advertisement").remove();

    // Extract text from main content areas
    const mainContent = $("article, main, .content, #content, .post, .entry")
      .first()
      .text();

    // If no main content area is found, fall back to body content
    const textContent = mainContent || $("body").text();

    // Clean up the text
    const cleanText = textContent
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    return res.status(200).json({ text: cleanText });
  } catch (error) {
    console.error("Error fetching webpage:", error);
    return res.status(500).json({ error: "Failed to fetch webpage content" });
  }
}
