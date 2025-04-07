import {
  ParsedRedditApiResponse,
  ParsedRedditPostData,
} from "@/lib/types/redditApiTypes";

/**
 * Utility functions for extracting data from VALIDATED Reddit JSON responses
 */

// Helper to get the post data (assumes validation already happened)
const getPostData = (
  validatedData: ParsedRedditApiResponse
): ParsedRedditPostData | undefined => {
  return validatedData[0]?.data?.children?.[0]?.data;
};

export function extractOP(validatedData: ParsedRedditApiResponse): string {
  // Schema default handles 'Unknown'
  return getPostData(validatedData)?.author ?? "Unknown";
}

export function extractSubreddit(
  validatedData: ParsedRedditApiResponse
): string {
  const postData = getPostData(validatedData);
  if (!postData) return "Unknown";
  // Prefer prefixed name, fallback to regular name, then schema default
  return (
    postData.subreddit_name_prefixed || `r/${postData.subreddit}` || "Unknown"
  );
}

export function extractCommentCount(
  validatedData: ParsedRedditApiResponse
): number {
  // Schema default handles 0
  return getPostData(validatedData)?.num_comments ?? 0;
}

export function extractCreatedDate(
  validatedData: ParsedRedditApiResponse
): string {
  const timestamp = getPostData(validatedData)?.created_utc;
  if (timestamp) {
    try {
      return new Date(timestamp * 1000).toISOString();
    } catch (e) {
      console.error("Error converting timestamp to Date:", e);
      return "Invalid Date";
    }
  }
  return "Unknown"; // Handle case where timestamp is missing even after validation (though schema makes it optional)
}

export function extractUpvotes(validatedData: ParsedRedditApiResponse): string {
  // Schema default handles 0, convert to string
  return (getPostData(validatedData)?.score ?? 0).toString();
}
