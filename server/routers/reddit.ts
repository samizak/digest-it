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

      // Use a Set to keep track of URLs added to avoid duplicates
      const addedUrls = new Set<string>(extractedLinks.map((link) => link.url));

      // Helper function to add a link if the URL is unique
      const addUniqueLink = (url: string, text: string) => {
        const cleanedUrl = url.replace(/&amp;/g, "&"); // Decode entities
        if (!addedUrls.has(cleanedUrl)) {
          extractedLinks.push({ url: cleanedUrl, text });
          addedUrls.add(cleanedUrl);
          return true;
        }
        return false;
      };

      // Add the main post link if it's unique and not the same as the submitted URL
      if (
        postMainLink &&
        postMainLink !== input.redditUrl &&
        !addedUrls.has(postMainLink)
      ) {
        const linkText =
          postData?.title || postMainLink.split("/")[2] || postMainLink;
        // Try adding - unshift puts it at the front if added
        if (addUniqueLink(postMainLink, linkText)) {
          const addedLink = extractedLinks.pop(); // Remove from end
          if (addedLink) extractedLinks.unshift(addedLink); // Add to beginning
        }
      }

      // --- Extract Media (Images/Videos) from metadata and media objects ---
      let imageCount = 0;

      // Extract from media_metadata (handles galleries and single images with metadata)
      if (postData?.media_metadata) {
        console.log("Backend: Processing media_metadata...");
        for (const mediaId in postData.media_metadata) {
          const metadata = postData.media_metadata[mediaId];
          // Prefer highest resolution source image 's.u'
          if (metadata?.s?.u) {
            imageCount++;
            const imageText = `${postData.title || "Image"} ${imageCount}`;
            if (addUniqueLink(metadata.s.u, imageText)) {
              console.log(
                `Backend: Added image from metadata: ${metadata.s.u}`
              );
            }
          }
          // Optional: Fallback to preview images 'p' if 's' is missing?
          // else if (metadata?.p?.length) { ... }
        }
      }

      // Extract from media/secure_media (handles videos)
      const videoUrl =
        postData?.media?.reddit_video?.fallback_url ||
        postData?.secure_media?.reddit_video?.fallback_url;

      if (videoUrl) {
        console.log("Backend: Processing media object for video...");
        const videoText = `${postData?.title || "Video"}`;
        if (addUniqueLink(videoUrl, videoText)) {
          console.log(`Backend: Added video: ${videoUrl}`);
        }
      }

      // Remove the old gallery-specific extraction block
      /*
      if (postData?.is_gallery && ...) { ... }
      */

      console.log(
        `Backend: Final link count after media extraction: ${extractedLinks.length}`
      );

      // --- 4. Generate Summarization Prompt ---
      // Re-enable prompt generation
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

      // --- 5. Call LLM Service ---
      // Re-enable LLM call
      console.log("Backend: Calling LLM Service...");

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

      // --- 6. Parse LLM Response ---
      // Remove template data creation block
      /*
      console.log("Backend: Creating template summary data");
      // ... template data ...
      let summaryJson: Partial<SummaryData> = { ... };
      */

      // Re-enable LLM response parsing
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
          // If no JSON block, try parsing the whole string
          // Handle potential leading/trailing non-JSON text cautiously
          jsonStringToParse = llmResponseString.trim();
          if (
            jsonStringToParse.startsWith("{") &&
            jsonStringToParse.endsWith("}")
          ) {
            console.log(
              "Backend: No JSON fence found, attempting to parse entire trimmed response as JSON."
            );
          } else {
            console.warn(
              "Backend: LLM response does not appear to be JSON. Attempting parse anyway."
            );
          }
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

      // --- 7. Enhance and Return Summary ---
      // Add extracted links to the summary object
      summaryJson.links = extractedLinks;
      console.log(
        "Backend: Added extracted links to LLM summary data:",
        extractedLinks
      );

      // Re-enable stats enhancement if necessary
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

      console.log("Backend: LLM summary generation complete.");
      return summaryJson as SummaryData;
    }),
});
