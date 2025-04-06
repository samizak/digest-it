/**
 * Utility functions for extracting data from Reddit JSON responses
 */

export function extractOP(data: any): string {
  try {
    return data[0]?.data?.children[0]?.data?.author || "Unknown";
  } catch (e) {
    return "Unknown";
  }
}

export function extractSubreddit(data: any): string {
  try {
    return data[0]?.data?.children[0]?.data?.subreddit_name_prefixed || 
           "r/" + (data[0]?.data?.children[0]?.data?.subreddit || "Unknown");
  } catch (e) {
    return "Unknown";
  }
}

export function extractCommentCount(data: any): number {
  try {
    return data[0]?.data?.children[0]?.data?.num_comments || 0;
  } catch (e) {
    return 0;
  }
}

export function extractCreatedDate(data: any): string {
  try {
    const timestamp = data[0]?.data?.children[0]?.data?.created_utc;
    if (timestamp) {
      return new Date(timestamp * 1000).toISOString();
    }
    return "Unknown";
  } catch (e) {
    return "Unknown";
  }
}

export function extractUpvotes(data: any): string {
  try {
    return data[0]?.data?.children[0]?.data?.score?.toString() || "0";
  } catch (e) {
    return "0";
  }
}