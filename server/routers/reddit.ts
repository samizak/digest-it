import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import fs from "fs/promises";
import path from "path";
import { SummaryData } from "@/lib/types/summaryTypes";
import {
  extractOP,
  extractSubreddit,
  extractCommentCount,
  extractCreatedDate,
  extractUpvotes,
} from "@/lib/utils/redditDataExtractor";
import { generateSummary } from "@/lib/services/geminiService";

// Remove duplicate Gemini initialization code

export const redditRouter = router({
  getRedditJson: publicProcedure
    .input(z.object({ redditUrl: z.string() }))
    .mutation(async ({ input }) => {
      // Extract post ID from the URL
      const postIdMatch = input.redditUrl.match(/\/comments\/([a-zA-Z0-9]+)/i);
      if (!postIdMatch) {
        throw new Error("Could not extract post ID from the provided URL");
      }

      const postId = postIdMatch[1];
      const jsonUrl = `https://www.reddit.com/comments/${postId}.json`;

      // Fetch data from Reddit's JSON API
      const response = await fetch(jsonUrl, {
        headers: {
          "User-Agent": "web:digest-it:v1.0 (by /u/your_username)",
        },
      });

      if (!response.ok) {
        console.error(
          `Backend: Failed to fetch Reddit data for ${jsonUrl}. Status: ${response.status} ${response.statusText}`
        );
        throw new Error(`Failed to fetch Reddit data: ${response.statusText}`);
      }

      const jsonData = await response.json();
      return jsonData;
    }),

  summarize: publicProcedure
    .input(
      z.object({
        redditUrl: z.string(),
        redditData: z.any(),
      })
    )
    .mutation(async ({ input }): Promise<SummaryData> => {
      // Read Prompt Template
      const promptFilePath = path.join(
        process.cwd(),
        "lib",
        "prompts",
        "summarizePrompt.md"
      );
      const promptTemplate = await fs.readFile(promptFilePath, "utf-8");

      // Inject Fetched Data into Prompt
      const redditDataString = JSON.stringify(input.redditData, null, 2);
      const finalPrompt = promptTemplate.replace(
        "[INSERT REDDIT THREAD JSON DATA HERE]",
        redditDataString
      );

      // Call Gemini API using the service
      const llmResponseString = await generateSummary(finalPrompt);

      // Parse LLM Response
      try {
        let jsonString = "";
        // First, try to extract JSON fenced in ```json ... ```
        const jsonRegex = /```json\n?([\s\S]*?)```/;
        const match = llmResponseString.match(jsonRegex);

        if (match && match[1]) {
          // Found fenced JSON
          jsonString = match[1].trim();
          console.log("Extracted JSON using regex.");
        } else {
          // No fence found, assume the whole response might be JSON
          console.log(
            "No JSON fence found, attempting to parse entire response."
          );
          jsonString = llmResponseString.trim();
        }

        // Try parsing the extracted/assumed JSON string
        const summaryJson = JSON.parse(jsonString);

        // Enhance the response with extracted data if needed
        if (!summaryJson.stats || Object.keys(summaryJson.stats).length === 0) {
          console.log("No stats in LLM response, adding extracted data");
          summaryJson.stats = {
            op: extractOP(input.redditData),
            subreddit: extractSubreddit(input.redditData),
            created: extractCreatedDate(input.redditData),
            upvotes: extractUpvotes(input.redditData),
            comments: extractCommentCount(input.redditData),
          };
        }

        return summaryJson;
      } catch (parseError) {
        console.error("Error parsing LLM response JSON:", parseError);
        console.error("Original LLM response string:", llmResponseString);
        throw new Error("Failed to parse summary from LLM response");
      }
    }),
});
