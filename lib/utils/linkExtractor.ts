import { LinkData } from "@/lib/types/summaryTypes";

/**
 * Truncates a URL string for display.
 * Removes protocol, www, and limits length.
 */
function truncateUrlForDisplay(url: string, maxLength = 50): string {
  try {
    let displayUrl = url.replace(/^https?:\/\/(?:www\.)?/, ""); // Remove protocol and www.
    if (displayUrl.length > maxLength) {
      displayUrl = displayUrl.substring(0, maxLength - 3) + "...";
    }
    return displayUrl;
  } catch (e) {
    // Fallback in case of unexpected URL format
    return url.length > maxLength
      ? url.substring(0, maxLength - 3) + "..."
      : url;
  }
}

/**
 * Extracts HTTP/HTTPS links from a given text, attempting to find context
 * and using truncated URLs for standalone links.
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
  const markdownRegex = /\[([^\]]+)\]\(\s*(https?:\/\/[^\s\)]+)\s*\)/g;
  let mdMatch;
  while ((mdMatch = markdownRegex.exec(text)) !== null) {
    const linkText = mdMatch[1].trim();
    let url = mdMatch[2].trim();
    if (url && linkText) {
      // Clean trailing punctuation from URL captured within markdown too
      url = url.replace(/[.,;:)\]}'\"]+$/, "");
      linksMap.set(url, { url, text: linkText });
    }
  }

  // Regex 2: Find standalone URLs (http/https)
  const standaloneUrlRegex =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  let urlMatch;
  while ((urlMatch = standaloneUrlRegex.exec(text)) !== null) {
    let url = urlMatch[0];

    // Clean trailing punctuation before checking map
    url = url.replace(/[.,;:)\]}'\"]+$/, "");

    // Only add if this cleaned URL wasn't already found (likely via Markdown)
    if (url && !linksMap.has(url)) {
      // Use the truncated *cleaned* URL as the link text
      const truncatedText = truncateUrlForDisplay(url);
      linksMap.set(url, { url, text: truncatedText });
    }
  }

  // --- Filtering Step ---
  const urls = Array.from(linksMap.keys());
  urls.forEach((url1) => {
    // Check if url1 is a prefix of any *other* longer URL in the list
    const isPrefix = urls.some(
      (url2) => url2 !== url1 && url2.startsWith(url1)
    );
    if (isPrefix) {
      // If url1 is a prefix of another URL, remove it
      linksMap.delete(url1);
      console.log(`Filtering out prefix URL: ${url1}`); // Log filtering
    }
  });

  // Convert the filtered map values back to an array
  return Array.from(linksMap.values());
}
