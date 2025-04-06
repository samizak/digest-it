import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import fs from 'fs/promises';
import path from 'path';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from "@google/generative-ai";

// Initialize Google AI Client
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Configure generation settings
const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.3,
};

// Helper functions to extract data from Reddit JSON
function extractOP(data: any): string {
  try {
    return data[0]?.data?.children[0]?.data?.author || "Unknown";
  } catch (e) {
    return "Unknown";
  }
}

function extractSubreddit(data: any): string {
  try {
    return data[0]?.data?.children[0]?.data?.subreddit_name_prefixed || 
           "r/" + (data[0]?.data?.children[0]?.data?.subreddit || "Unknown");
  } catch (e) {
    return "Unknown";
  }
}

function extractCommentCount(data: any): number {
  try {
    return data[0]?.data?.children[0]?.data?.num_comments || 0;
  } catch (e) {
    return 0;
  }
}

function extractCreatedDate(data: any): string {
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

function extractUpvotes(data: any): string {
  try {
    return data[0]?.data?.children[0]?.data?.score?.toString() || "0";
  } catch (e) {
    return "0";
  }
}

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
    .mutation(async ({ input }) => {
      if (!genAI) {
        throw new Error("Server configuration error: Missing API key");
      }
      
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
      
      // Call Gemini API
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro-exp-03-25",
        safetySettings: safetySettings,
        generationConfig: generationConfig,
      });
      
      const result = await model.generateContent(finalPrompt);
      const response = result.response;
      
      if (!response || !response.text) {
        if (response?.promptFeedback?.blockReason) {
          throw new Error(`Content blocked by API: ${response.promptFeedback.blockReason}`);
        }
        throw new Error("Failed to get valid response from LLM");
      }
      
      const llmResponseString = response.text();
      
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