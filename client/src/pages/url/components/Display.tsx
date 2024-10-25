import React, { useState, useEffect } from "react";
import Play from "./Play";

const Display = ({ fetchedContent }: { fetchedContent: string | null }) => {
  const [formattedContent, setFormattedContent] = useState<JSX.Element | null>(
    null
  );

  useEffect(() => {
    if (fetchedContent) {
      // Parse the fetched content to create structured elements
      const parser = new DOMParser();
      const doc = parser.parseFromString(fetchedContent, "text/html");

      // Extract the relevant content from the chapter-content class
      const chapterContent = doc.querySelector(".chapter-content");

      // If there's chapter content, format it
      if (chapterContent) {
        setFormattedContent(formatContent(chapterContent));
      } else {
        setFormattedContent(<p>No content found.</p>);
      }
    }
  }, [fetchedContent]);

  const formatContent = (element: Element) => {
    // Create an array to hold formatted elements
    const formattedElements: JSX.Element[] = [];

    // Define a list of elements to include in the formatting
    const elementsToInclude = [
      { tag: "h1", component: "h1" },
      { tag: "h2", component: "h2" },
      { tag: "h3", component: "h3" },
      { tag: "p", component: "p" },
      { tag: "blockquote", component: "blockquote" },
      { tag: "ul", component: "ul", listItem: true },
      { tag: "ol", component: "ol", listItem: true },
      { tag: "li", component: "li", listItem: false },
      { tag: "div", component: "div" },
    ];

    // Loop through each defined element type
    elementsToInclude.forEach(({ tag, component, listItem }) => {
      const elements = Array.from(element.getElementsByTagName(tag));

      elements.forEach((el, index) => {
        const parent = el.parentNode as ParentNode;

        if (listItem && component === "li") {
          // If it's a list item, wrap it in a parent <ul> or <ol> if not already done
          if (
            parent &&
            (parent.nodeName === "UL" || parent.nodeName === "OL")
          ) {
            formattedElements.push(
              <li key={`${tag}-${index}`}>{el.textContent}</li>
            );
          }
        } else if (
          component === "h1" ||
          component === "h2" ||
          component === "h3"
        ) {
          // For headings, render each heading found
          formattedElements.push(
            React.createElement(
              component,
              { key: `${tag}-${index}`, className: "text-xl font-bold mt-4" },
              el.textContent
            )
          );
        } else if (component === "p") {
          // For paragraphs, render each paragraph found
          formattedElements.push(
            <p key={index} className="mb-4">
              {el.textContent}
            </p>
          );
        } else {
          // For other elements, render directly
          formattedElements.push(
            React.createElement(
              component,
              { key: `${tag}-${index}`, className: listItem ? "mb-2" : "" },
              el.textContent
            )
          );
        }
      });
    });

    return <>{formattedElements}</>;
  };

  return (
    <div className="text-black w-full">
      <Play formattedContent={formattedContent} />
    </div>
  );
};

export default Display;
