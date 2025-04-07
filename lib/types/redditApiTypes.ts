import { z } from "zod";

// Schema for the actual post data within the listing
const RedditPostDataSchema = z.object({
  author: z.string().optional().default("Unknown"),
  subreddit_name_prefixed: z.string().optional(),
  subreddit: z.string().optional().default("Unknown"),
  num_comments: z.number().int().nonnegative().optional().default(0),
  created_utc: z.number().positive().optional(),
  score: z.number().int().optional().default(0),
});

// Schema for a child element in the listing (which contains the post data)
const RedditChildSchema = z.object({
  kind: z.string(), // Typically "t3" for posts
  data: RedditPostDataSchema,
});

// Schema for the top-level listing structure
const RedditListingDataSchema = z.object({
  children: z.array(RedditChildSchema).nonempty(), // Ensure there's at least one child (the post)
  // We might add 'after' and 'before' if needed for pagination later
});

// Schema for the overall Reddit API response, which is an array of listings
// The first listing ([0]) contains the post details.
// The second listing ([1]) usually contains the comments (which we might need later).
export const RedditApiResponseSchema = z
  .array(
    z.object({
      kind: z.string(), // Typically "Listing"
      data: RedditListingDataSchema,
    })
  )
  .min(1); // Ensure we get at least the post listing

// Type alias inferred from the schema for convenient use
export type ParsedRedditApiResponse = z.infer<typeof RedditApiResponseSchema>;
export type ParsedRedditPostData = z.infer<typeof RedditPostDataSchema>;
