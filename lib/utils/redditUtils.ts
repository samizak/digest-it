// Helper function for Reddit Thread URL Validation
export const isValidRedditThreadUrl = (url: string): boolean => {
  // Regex to match patterns like:
  // https://www.reddit.com/r/subreddit/comments/post_id/...
  // https://reddit.com/r/subreddit/comments/post_id/...
  // https://old.reddit.com/r/subreddit/comments/post_id/...
  // Allows for optional www/old subdomain, requires /r/, subreddit, /comments/, post_id
  const redditThreadRegex =
    /^https?:\/\/(www\.|old\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/comments\/[a-zA-Z0-9]+/i;
  return redditThreadRegex.test(url);
};

// Helper function to extract post ID from Reddit URL
export const extractRedditPostId = (url: string): string | null => {
  // Match the post ID from URLs like:
  // https://www.reddit.com/r/subreddit/comments/post_id/...
  const match = url.match(/\/comments\/([a-zA-Z0-9]+)/i);
  return match ? match[1] : null;
};