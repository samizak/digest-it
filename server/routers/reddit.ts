import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import fs from 'fs/promises';
import path from 'path';
import { SummaryData } from "@/lib/types/summaryTypes";
import { 
  extractOP, 
  extractSubreddit, 
  extractCommentCount, 
  extractCreatedDate, 
  extractUpvotes 
} from "@/lib/utils/redditDataExtractor";
import { generateSummary } from "@/lib/services/geminiService";

// Remove duplicate Gemini initialization code

export const redditRouter = router({
  getRedditJson: publicProcedure
    .input(z.object({ redditUrl: z.string() }))
    .query(async ({ input }) => {
      // Extract post ID from the URL
      const postIdMatch = input.redditUrl.match(/\/comments\/([a-zA-Z0-9]+)/i);
      if (!postIdMatch) {
        throw new Error('Could not extract post ID from the provided URL');
      }
      
      const postId = postIdMatch[1];
      const jsonUrl = `https://www.reddit.com/comments/${postId}.json`;
      
      // Fetch data from Reddit's JSON API
      const response = await fetch(jsonUrl, {
        headers: {
          'User-Agent': 'web:digest-it:v1.0 (by /u/your_username)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Reddit data: ${response.statusText}`);
      }
      
      return await response.json();
    }),
    
  summarize: publicProcedure
    .input(z.object({ 
      redditUrl: z.string(),
      redditData: z.any()
    }))
    .mutation(async ({ input }): Promise<SummaryData> => {
      // Read Prompt Template
      const promptFilePath = path.join(
        process.cwd(),
        "lib",
        "prompts",
        "summarizePrompt.md"
      );
      const promptTemplate = await fs.readFile(promptFilePath, "utf-8");
      
      // Log some basic info from the data to verify
      console.log("Reddit data summary:");
      console.log("- OP:", extractOP(input.redditData));
      console.log("- Subreddit:", extractSubreddit(input.redditData));
      console.log("- Comments:", extractCommentCount(input.redditData));
      console.log("- Created:", extractCreatedDate(input.redditData));
      console.log("- Upvotes:", extractUpvotes(input.redditData));
      
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
        // Clean the response string: Remove potential markdown code fences
        const cleanedLlmResponseString = llmResponseString
          .replace(/^```json\s*|```$/g, "")
          .trim();
        const summaryJson = JSON.parse(cleanedLlmResponseString);
        
        // Enhance the response with extracted data if needed
        if (!summaryJson.stats || Object.keys(summaryJson.stats).length === 0) {
          console.log("No stats in LLM response, adding extracted data");
          summaryJson.stats = {
            op: extractOP(input.redditData),
            subreddit: extractSubreddit(input.redditData),
            created: extractCreatedDate(input.redditData),
            upvotes: extractUpvotes(input.redditData),
            comments: extractCommentCount(input.redditData)
          };
        }
        
        return summaryJson;
      } catch (parseError) {
        console.error("Error parsing LLM response JSON:", parseError);
        throw new Error("Failed to parse summary from LLM response");
      }
    })
});