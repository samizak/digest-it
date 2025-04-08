import { LinkData } from "@/lib/types/summaryTypes";

/**
 * Decodes common HTML entities (&amp;) and removes markdown escape backslashes.
 */
function cleanUrlString(url: string): string {
  let cleaned = url.replace(/&amp;/g, "&"); // Decode &amp;
  // Explicitly replace common escaped characters in URLs
  cleaned = cleaned.replace(/\\\//g, "/"); // Replace \/ with /
  cleaned = cleaned.replace(/\\\#/g, "#"); // Replace \# with #
  cleaned = cleaned.replace(/\\\_/g, "_"); // Replace \_ with _
  // Add others like \% \? \& \= if they become necessary
  cleaned = cleaned.replace(/[.,;:)\]}'"]+$/, ""); // Clean trailing punctuation
  return cleaned;
}

/**
 * Truncates a URL string for display.
 * Removes protocol, www, and limits length.
 */
function truncateUrlForDisplay(url: string, maxLength = 50): string {
  try {
    let displayUrl = url.replace(/^https?:\/\/(?:www\.)?/, "");
    if (displayUrl.length > maxLength) {
      displayUrl = displayUrl.substring(0, maxLength - 3) + "...";
    }
    return displayUrl;
  } catch (e) {
    return url.length > maxLength
      ? url.substring(0, maxLength - 3) + "..."
      : url;
  }
}

/**
 * Extracts filename from a URL path.
 */
function getFilenameFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split("/");
    return parts[parts.length - 1] || null;
  } catch (e) {
    return null;
  }
}

/**
 * Extracts HTTP/HTTPS links from a given text, attempting to find context
 * and using truncated URLs for standalone links. Filters out inner Reddit image URLs.
 * @param text - The text to search for links.
 * @returns An array of unique LinkData objects.
 */
export function extractLinksFromText(text: string): LinkData[] {
  if (!text) {
    return [];
  }

  const linksMap = new Map<string, LinkData>();

  // --- Pass 1: Markdown Links ---
  const markdownRegex = /\[([^\]]+)\]\(\s*(https?:\/\/[^\s\)]+)\s*\)/g;
  let mdMatch;
  while ((mdMatch = markdownRegex.exec(text)) !== null) {
    const linkText = mdMatch[1].trim();
    let url = mdMatch[2].trim();
    if (url && linkText) {
      url = cleanUrlString(url);
      linksMap.set(url, { url, text: linkText });
    }
  }

  // --- Pass 2: Standalone URLs ---
  const standaloneUrlRegex =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  let urlMatch;
  while ((urlMatch = standaloneUrlRegex.exec(text)) !== null) {
    let url = urlMatch[0];
    url = cleanUrlString(url);

    // *** Skip inner Reddit preview/image URLs when found standalone ***
    if (/\/\/(preview|i)\.redd\.it\//.test(url)) {
      console.log(`Skipping inner Reddit URL: ${url}`);
      continue;
    }

    // Only add if this cleaned URL wasn't already found (likely via Markdown)
    if (url && !linksMap.has(url)) {
      let linkText = "";
      // Generate specific text for Reddit media links
      if (/\/\/www\.reddit\.com\/media\?url=/.test(url)) {
        try {
          const innerUrlParam = new URL(url).searchParams.get("url");
          if (innerUrlParam) {
            const filename = getFilenameFromUrl(
              decodeURIComponent(innerUrlParam)
            );
            linkText = filename
              ? `Reddit Image: ${filename}`
              : "Reddit Image Link";
          } else {
            linkText = "Reddit Media Link";
          }
        } catch (e) {
          linkText = "Reddit Media Link (Err)"; // Fallback
        }
      } else {
        // Default: Use the truncated URL path as the link text
        linkText = truncateUrlForDisplay(url);
      }
      linksMap.set(url, { url, text: linkText });
    }
  }

  // --- Pass 3: Filtering Prefixes (Optional but safe) ---
  const urls = Array.from(linksMap.keys());
  urls.forEach((url1) => {
    const isPrefix = urls.some(
      (url2) => url2 !== url1 && url2.startsWith(url1)
    );
    if (isPrefix) {
      linksMap.delete(url1);
      console.log(`Filtering out prefix URL: ${url1}`);
    }
  });

  return Array.from(linksMap.values());
}
