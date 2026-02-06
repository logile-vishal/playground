import React from "react";

/**
 * @method escapeRegExp
 * @description Escapes special regular expression characters in a string.
 * Essential for safe use of user input in regex patterns.
 * @param {string} str - The string to escape special regex characters in
 * @returns {string} The escaped string safe for use in regular expressions
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @method boldSearchedWord
 * @description Highlights search terms in text by wrapping matches with bold tags.
 * Performs case-insensitive matching and returns a React element with highlighted text.
 * @param {string} element - The text content to search within
 * @param {string} targetWord - The word/phrase to highlight in the text
 * @returns {React.ReactElement | string} React element with highlighted text or original element
 */
export function boldSearchedWord(element, targetWord) {
  if (!targetWord || typeof element !== "string") {
    return element;
  }

  const regex = new RegExp(`(${escapeRegExp(targetWord)})`, "gi");

  const result = element.replace(regex, `<b>$1</b>`);

  return React.createElement("span", {
    dangerouslySetInnerHTML: { __html: result },
  });
}
