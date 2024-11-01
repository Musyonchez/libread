import React, { useState, useEffect, useCallback } from "react";
import Play from "./Play";

const Display = ({ fetchedContent }: { fetchedContent: string | null }) => {
  const [formattedContent, setFormattedContent] = useState<JSX.Element | null>(
    null,
  );

  const formatContent = useCallback((element: Element | Document) => {
    const formattedElements: JSX.Element[] = [];

    element.childNodes.forEach((node, index) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Handle text nodes, ensuring the content is not just whitespace
        const text = node.textContent?.trim();
        if (text) {
          formattedElements.push(
            <p key={`text-${index}`} className="mb-4">
              {text}
            </p>,
          );
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        switch (el.tagName) {
          case "H1":
          case "H2":
          case "H3":
            // Headings: Render each as their respective tags
            formattedElements.push(
              React.createElement(
                el.tagName.toLowerCase(),
                {
                  key: `${el.tagName}-${index}`,
                },
                el.textContent,
              ),
            );
            break;

          case "P":
            // Paragraphs: Render as <p> elements
            formattedElements.push(<p key={`p-${index}`}>{el.textContent}</p>);
            break;

          case "BR":
            // Line breaks: Render as <br /> elements
            formattedElements.push(<br key={`br-${index}`} />);
            break;

          case "DIV":
          case "SECTION":
          case "ARTICLE":
            // Recursive handling for nested content within divs, sections, articles
            formattedElements.push(
              <div key={`div-${index}`}>{formatContent(el)}</div>,
            );
            break;

          case "UL":
          case "OL":
            // Lists: Render as <ul> or <ol>, handling their children <li>
            const listItems = Array.from(el.getElementsByTagName("li")).map(
              (li, liIndex) => <li key={`li-${liIndex}`}>{li.textContent}</li>,
            );
            formattedElements.push(
              React.createElement(
                el.tagName.toLowerCase(),
                {
                  key: `${el.tagName}-${index}`,
                },
                listItems,
              ),
            );
            break;

          default:
            // Default case: Render unsupported elements as plain divs
            formattedElements.push(
              <div key={`default-${index}`}>{el.textContent}</div>,
            );
            break;
        }
      }
    });

    return <>{formattedElements}</>;
  }, []);

  useEffect(() => {
    if (fetchedContent) {
      // Parse the fetched content to create structured elements
      const parser = new DOMParser();
      const doc = parser.parseFromString(fetchedContent, "text/html");

      // Define potential selectors for the content area
      const selectors = [
        "#main-content", // Assuming the main content is within an element with this ID
        ".article-body", // Common class for article bodies
        ".content-wrapper", // Wrapper around the main content
        ".chapter-content", // As per your original requirement
        "div.content", // Div with a class of 'content'
        "article", // Article tag
        "section", // Section tag
      ];

      let contentElement;

      // Try each selector until we find a match
      for (const selector of selectors) {
        contentElement = doc.querySelector(selector);
        if (contentElement) {
          break;
        }
      }

      if (!contentElement) {
        contentElement = doc.body || doc.documentElement;
      }

      // If we found content, format it
      if (contentElement) {
        console.log("contentElement from display.txt", contentElement);
        setFormattedContent(formatContent(contentElement));
      } else {
        setFormattedContent(<p>No content found.</p>);
      }
    }
  }, [fetchedContent, formatContent]);

  return (
    <div className="text-black w-full">
      <Play formattedContent={formattedContent} />
      {/* <p>{formattedContent}</p> */}
    </div>
  );
};

export default Display;
