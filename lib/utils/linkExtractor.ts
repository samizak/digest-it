import { LinkData } from "@/lib/types/summaryTypes";

/**
 * Extracts HTTP/HTTPS links from a given text, attempting to find context.
 * @param text - The text to search for links.
 * @returns An array of unique LinkData objects.
 */
export function extractLinksFromText(text: string): LinkData[] {
  if (!text) {
    return [];
  }

  // Use a Map to store links, ensuring URL uniqueness and allowing text override
  const linksMap = new Map<string, LinkData>();

  // Regex 1: Find Markdown links like [link text](url)
  const markdownRegex = /\[([^\]]+)\]\(\s*(https?:\/\/[^\s\)])+\s*\)/g;
  let mdMatch;
  while ((mdMatch = markdownRegex.exec(text)) !== null) {
    const linkText = mdMatch[1].trim();
    const url = mdMatch[2].trim();
    if (url && linkText) {
      // Add/update the entry with the specific text from Markdown
      linksMap.set(url, { url, text: linkText });
    }
  }

  // Regex 2: Find standalone URLs (http/https)
  // Improved regex to better handle valid URL characters and avoid trailing punctuation
  const standaloneUrlRegex =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  let urlMatch;
  while ((urlMatch = standaloneUrlRegex.exec(text)) !== null) {
    const url = urlMatch[0];
    // Only add if it wasn't already found as part of a Markdown link
    if (url && !linksMap.has(url)) {
      try {
        // Use the domain name as default text, removing www.
        const domain = new URL(url).hostname.replace(/^www\./, "");
        linksMap.set(url, { url, text: domain });
      } catch (e) {
        // Fallback for potential invalid URLs caught by regex (less likely now)
        console.warn(
          `Regex matched potentially invalid standalone URL: ${url}`
        );
        linksMap.set(url, { url, text: url }); // Use URL itself as text
      }
    }
  }

  // Convert the map values back to an array
  return Array.from(linksMap.values());
}
