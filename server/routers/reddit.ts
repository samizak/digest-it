import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import fs from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";
import { SummaryData } from "@/lib/types/summaryTypes";
import { RedditApiResponseSchema } from "@/lib/types/redditApiTypes";
import {
  extractOP,
  extractSubreddit,
  extractCommentCount,
  extractCreatedDate,
  extractUpvotes,
} from "@/lib/utils/redditDataExtractor";
import { generateSummary } from "@/lib/services/geminiService";
import { extractLinksFromText } from "@/lib/utils/linkExtractor";

export const redditRouter = router({
  getSummaryFromUrl: publicProcedure
    .input(
      z.object({
        redditUrl: z
          .string()
          .url({ message: "Invalid Reddit URL format." })
          .refine(
            (url) =>
              url.includes("reddit.com/r/") && url.includes("/comments/"),
            { message: "URL must be a valid Reddit comment thread URL." }
          ),
      })
    )
    .mutation(async ({ input }): Promise<SummaryData> => {
      console.log(
        `Backend: getSummaryFromUrl received URL: '${input.redditUrl}'`
      );

      // --- 1. Extract Post ID & Fetch Reddit JSON ---
      const postIdMatch = input.redditUrl.match(/\/comments\/([a-zA-Z0-9]+)/i);
      if (!postIdMatch || !postIdMatch[1]) {
        // This should be rare due to Zod validation, but good practice
        console.error(
          "Backend: Failed to extract post ID after Zod validation."
        );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not extract post ID from the validated URL.",
        });
      }
      const postId = postIdMatch[1];
      const jsonUrl = `https://www.reddit.com/comments/${postId}.json?limit=50`; // Added limit for comments
      console.log(`Backend: Fetching Reddit data from: ${jsonUrl}`);

      let rawRedditData: unknown;
      try {
        const response = await fetch(jsonUrl, {
          headers: {
            // It's good practice to have a specific User-Agent
            "User-Agent": "web:digest-it:v1.0 (by /u/digest-it-dev)",
          },
        });
        if (!response.ok) {
          console.error(
            `Backend: Failed to fetch Reddit data for ${jsonUrl}. Status: ${response.status} ${response.statusText}`
          );
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to fetch Reddit data: ${response.statusText} (Status: ${response.status})`,
          });
        }
        rawRedditData = await response.json();
        console.log(`Backend: Successfully fetched Reddit JSON for ${jsonUrl}`);
      } catch (error) {
        console.error(
          `Backend: Error fetching Reddit data from ${jsonUrl}:`,
          error
        );
        if (error instanceof TRPCError) throw error; // Re-throw TRPC errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching data from Reddit.",
        });
      }

      // --- 2. Validate Reddit JSON using Zod Schema ---
      console.log("Backend: Validating fetched Reddit data...");
      const validationResult = RedditApiResponseSchema.safeParse(rawRedditData);

      if (!validationResult.success) {
        console.error(
          "Backend: Reddit data validation failed.",
          validationResult.error.flatten()
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to validate the structure of the data received from Reddit.",
          // Optionally pass Zod error details, be careful about exposing too much
          // cause: validationResult.error
        });
      }

      const validatedRedditData = validationResult.data; // Now fully typed!
      console.log("Backend: Reddit data validation successful.");

      // --- 3. Extract Links from Post Body (Moved Up) ---
      const postData = validatedRedditData[0]?.data?.children?.[0]?.data;
      const postSelfText = postData?.selftext || "";
      const postMainLink = postData?.url || null;
      let extractedLinks = extractLinksFromText(postSelfText);

      // If the post itself is a link post and the URL isn't already in selftext links, add it.
      if (
        postMainLink &&
        postMainLink !== input.redditUrl &&
        !extractedLinks.some((link) => link.url === postMainLink)
      ) {
        // Attempt to use the post title as the link text
        const linkText =
          postData?.title || postMainLink.split("/")[2] || postMainLink;
        extractedLinks.unshift({ url: postMainLink, text: linkText }); // Add to beginning
      }

      // Extract gallery images if present
      if (
        postData?.is_gallery &&
        postData.gallery_data &&
        postData.media_metadata
      ) {
        console.log(
          "Backend: Detected Reddit gallery post, extracting images..."
        );
        const galleryItems = postData.gallery_data.items;
        let galleryCount = 0;

        galleryItems.forEach((item) => {
          const mediaId = item.media_id;
          const metadata = postData.media_metadata?.[mediaId];

          if (metadata && metadata.s && metadata.s.u) {
            // Get the full-size image URL
            let imageUrl = metadata.s.u;
            // Reddit URLs often have amp; in them which needs to be decoded
            imageUrl = imageUrl.replace(/&amp;/g, "&");

            galleryCount++;
            const imageText = `${
              postData.title || "Gallery"
            } - Image ${galleryCount}`;

            extractedLinks.push({
              url: imageUrl,
              text: imageText,
            });
          }
        });

        console.log(`Backend: Extracted ${galleryCount} gallery images`);
      }

      console.log(
        `Backend: Extracted ${extractedLinks.length} links from post body.`
      );

      // --- 4. Generate Summarization Prompt ---
      // Commenting out prompt generation as we're bypassing Gemini
      /*
      const promptFilePath = path.join(
        process.cwd(),
        "lib",
        "prompts",
        "summarizePrompt.md"
      );
      const promptTemplate = await fs.readFile(promptFilePath, "utf-8");

      // Log extracted stats (using validated data)
      console.log("Backend: Extracted stats from validated data:");
      console.log("- OP:", extractOP(validatedRedditData));
      console.log("- Subreddit:", extractSubreddit(validatedRedditData));
      console.log("- Comments:", extractCommentCount(validatedRedditData));
      console.log("- Created:", extractCreatedDate(validatedRedditData));
      console.log("- Upvotes:", extractUpvotes(validatedRedditData));

      const redditDataString = JSON.stringify(validatedRedditData, null, 2); // Stringify the validated data
      const finalPrompt = promptTemplate.replace(
        "[INSERT REDDIT THREAD JSON DATA HERE]",
        redditDataString
      );
      */

      // --- 5. Call LLM Service --- (DISABLED)
      console.log(
        "Backend: BYPASSING LLM Service (template data will be used)"
      );

      /*
      let llmResponseString: string;
      try {
        llmResponseString = await generateSummary(finalPrompt);
        console.log(
          "Backend: Received raw LLM response string:\n",
          llmResponseString
        );
        console.log("Backend: Received LLM response.");
      } catch (error) {
        console.error("Backend: Error calling LLM service:", error);
        if (
          error instanceof Error &&
          error.message.includes("Content blocked by API")
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate summary due to an LLM service error.",
        });
      }
      */

      // --- 5. Create Template Summary Data ---
      console.log("Backend: Creating template summary data");

      // Extract useful stats now for the template
      const op = extractOP(validatedRedditData);
      const subreddit = extractSubreddit(validatedRedditData);
      const commentCount = extractCommentCount(validatedRedditData);
      const created = extractCreatedDate(validatedRedditData);
      const upvotes = extractUpvotes(validatedRedditData);

      // Create template summary JSON
      let summaryJson: Partial<SummaryData> = {
        quickGlance:
          "This is template data while testing link extraction functionality.",
        stats: {
          op,
          subreddit,
          created,
          upvotes,
          comments: commentCount,
        },
        keyPoints: [
          "This is a template key point 1 for testing.",
          "This is a template key point 2 for testing.",
          "This is a template key point 3 for testing.",
        ],
        topComment: {
          text: "This is a template top comment for testing purposes.",
          user: "template_user",
          votes: 100,
        },
        bestComment: {
          text: "This is a template best comment for testing purposes.",
          user: "template_user2",
          votes: 75,
        },
        sentiment: "Template sentiment analysis: neutral",
      };

      // Skip LLM Response parsing since we're using template data
      /*
      console.log("Backend: Parsing LLM response...");
      let summaryJson: Partial<SummaryData>; // Use Partial initially
      try {
        let jsonStringToParse = "";
        const jsonRegex = /```json\n?([\s\S]*?)```/;
        const match = llmResponseString.match(jsonRegex);

        if (match && match[1]) {
          jsonStringToParse = match[1].trim();
          console.log("Backend: Extracted JSON using regex.");
        } else {
          jsonStringToParse = llmResponseString.trim();
          console.log(
            "Backend: No JSON fence found, attempting to parse entire response."
          );
        }

        summaryJson = JSON.parse(jsonStringToParse);
        console.log("Backend: Successfully parsed LLM response JSON.");
      } catch (parseError) {
        console.error("Backend: Error parsing LLM response JSON:", parseError);
        console.error(
          "Backend: Original LLM response string:",
          llmResponseString
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to parse the summary structure from the LLM response.",
        });
      }
      */

      // Add extracted links to the summary object
      summaryJson.links = extractedLinks;
      console.log(
        "Backend: Added extracted links to template summary data:",
        extractedLinks
      );

      // We're using template data so no need to enhance with stats (already included)
      /*
      // Enhance the response with extracted (and validated) stats if missing
      if (!summaryJson.stats || Object.keys(summaryJson.stats).length === 0) {
        console.log(
          "Backend: No stats in LLM response, adding extracted stats."
        );
        summaryJson.stats = {
          op: extractOP(validatedRedditData),
          subreddit: extractSubreddit(validatedRedditData),
          created: extractCreatedDate(validatedRedditData),
          upvotes: extractUpvotes(validatedRedditData),
          comments: extractCommentCount(validatedRedditData),
        };
      }
      */

      console.log("Backend: Template summary generation complete.");
      return summaryJson as SummaryData;
    }),
});
