import { z } from "zod";

// Schema for individual comment data
const RedditCommentDataSchema = z.object({
  author: z.string().optional().default("[deleted]"),
  body: z.string().optional().default("[comment body not available]"), // Comment text
  score: z.number().int().optional().default(0),
  created_utc: z.number().positive().optional(),
  // Add is_submitter, distinguished, etc. if needed later
});

// Schema for a comment child element
const RedditCommentChildSchema = z.object({
  kind: z.literal("t1"), // Comments are kind "t1"
  data: RedditCommentDataSchema,
});

// Schema for the actual post data within the listing
const RedditPostDataSchema = z.object({
  author: z.string().optional().default("Unknown"),
  subreddit_name_prefixed: z.string().optional(),
  subreddit: z.string().optional().default("Unknown"),
  num_comments: z.number().int().nonnegative().optional().default(0),
  created_utc: z.number().positive().optional(),
  score: z.number().int().optional().default(0),
  selftext: z.string().optional().default(""), // <-- Add selftext for post body
  title: z.string().optional().default(""), // Might be useful context later
  url: z.string().url().optional(), // The main link of the post (if it's a link post)
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
// The second listing ([1]) contains the top-level comments.
export const RedditApiResponseSchema = z.tuple([
  // Post Listing
  z.object({
    kind: z.literal("Listing"),
    data: z.object({
      children: z
        .array(z.object({ kind: z.literal("t3"), data: RedditPostDataSchema }))
        .length(1),
    }), // Expect exactly 1 post
  }),
  // Comment Listing
  z.object({
    kind: z.literal("Listing"),
    data: z.object({
      children: z.array(
        RedditCommentChildSchema.or(z.object({ kind: z.literal("more") }))
      ),
    }), // Array of comments or 'more' objects
  }),
]);

// Type alias inferred from the schema for convenient use
export type ParsedRedditApiResponse = z.infer<typeof RedditApiResponseSchema>;
export type ParsedRedditPostData = z.infer<typeof RedditPostDataSchema>;
export type ParsedRedditCommentData = z.infer<typeof RedditCommentDataSchema>;
export type ParsedRedditCommentChild = z.infer<typeof RedditCommentChildSchema>; // Exporting this too
