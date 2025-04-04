// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from "@google/generative-ai";

// Define the expected structure of the request body
interface SummarizeRequestBody {
  redditUrl?: string;
}

// Define the expected structure of the LLM's successful response (adjust if needed)
interface SummaryResponse {
  quickGlance?: string;
  stats?: {
    op?: string;
    subreddit?: string;
    created?: string;
    upvotes?: string;
    comments?: number;
  };
  keyPoints?: string[];
  topComment?: {
    text?: string;
    user?: string;
    votes?: number;
  };
  sentiment?: string;
  links?: { text: string; url: string }[];
}

// --- Get API Key from Environment Variable ---
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error("CRITICAL: GOOGLE_API_KEY environment variable is not set.");
  // Optional: throw an error during server startup instead of handling it per request
  // throw new Error("Missing GOOGLE_API_KEY environment variable");
}
// -------------------------------------------

// --- Initialize Google AI Client ---
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
// -----------------------------------

// Configure safety settings (adjust as needed)
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

export async function POST(request: Request) {
  console.log("Summarize API route hit");

  if (!genAI) {
    console.error("Google AI SDK not initialized due to missing API key.");
    return NextResponse.json(
      { error: "Server configuration error: Missing API key" },
      { status: 500 }
    );
  }

  let requestBody: SummarizeRequestBody;
  let redditUrl: string;

  // 1. Parse Request Body and Get URL
  try {
    requestBody = await request.json();
    redditUrl = requestBody?.redditUrl ?? "";
    if (!redditUrl) {
      return NextResponse.json({ error: "Missing redditUrl" }, { status: 400 });
    }
    // Basic validation (could reuse the regex from frontend or improve)
    if (!/^https?:\/\/(www\.|old\.)?reddit\.com\/r\//i.test(redditUrl)) {
      return NextResponse.json(
        { error: "Invalid Reddit URL format provided" },
        { status: 400 }
      );
    }
    console.log("Received URL:", redditUrl);
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    // 2. Read Prompt Template
    const promptFilePath = path.join(
      process.cwd(),
      "lib",
      "prompts",
      "summarizePrompt.md"
    );
    console.log("Reading prompt from:", promptFilePath);
    const promptTemplate = await fs.readFile(promptFilePath, "utf-8");
    console.log("Prompt template read successfully.");

    // 3. --- PLACEHOLDER: Fetch Reddit Thread JSON Data ---
    console.log("Placeholder: Fetching Reddit data for", redditUrl);
    const redditJsonData: any = {
      // Replace 'any' with a proper type if you have one
      // Example structure - REPLACE WITH ACTUAL FETCHED DATA
      kind: "Listing",
      data: {
        children: [
          {
            kind: "t3", // Post
            data: {
              title: "Example Post Title from API",
              author: "api_user",
              selftext:
                "This is the post body from the API. It mentions https://example.com/article as a source.",
              subreddit: "api_subreddit",
              created_utc: Math.floor(Date.now() / 1000) - 3600, // Example timestamp
              score: 55,
              num_comments: 3,
              // ... other post fields
            },
          },
          {
            kind: "Listing", // Comments
            data: {
              children: [
                {
                  kind: "t1",
                  data: {
                    author: "commenter1",
                    body: "First comment text, linking to https://anothersite.org/page.",
                    score: 10,
                    replies: "" /* ... */,
                  },
                },
                {
                  kind: "t1",
                  data: {
                    author: "commenter2",
                    body: "Second comment text, just regular discussion.",
                    score: 5,
                    replies: "" /* ... */,
                  },
                },
              ],
            },
          },
        ],
      },
    };
    console.log("Placeholder: Using mock Reddit data.");
    // -------------------------------------------------------

    // 4. Inject Fetched Data into Prompt
    const redditDataString = JSON.stringify(redditJsonData, null, 2); // Use null, 2 for pretty printing if needed for debugging
    const finalPrompt = promptTemplate.replace(
      "[INSERT REDDIT THREAD JSON DATA HERE]",
      redditDataString
    );
    // console.log("Final prompt created (first 200 chars):", finalPrompt.substring(0, 200) + "...");

    // 5. --- Call Gemini API ---
    console.log("Calling Gemini API...");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25", // Using your specified experimental model
      safetySettings: safetySettings,
      generationConfig: generationConfig,
    });

    const result = await model.generateContent(finalPrompt);
    const response = result.response;

    if (!response || !response.text) {
      console.error(
        "Gemini API Error: No response or text found.",
        response?.promptFeedback
      );
      if (response?.promptFeedback?.blockReason) {
        console.error(
          `Content blocked: ${response.promptFeedback.blockReason}`,
          response.promptFeedback.safetyRatings
        );
        return NextResponse.json(
          {
            error: `Content blocked by API: ${response.promptFeedback.blockReason}`,
            details: response.promptFeedback.safetyRatings,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Failed to get valid response from LLM" },
        { status: 500 }
      );
    }

    const llmResponseString = response.text();
    console.log("Gemini API response received.");
    // console.log("Raw LLM Response String for Parsing:", llmResponseString); // Uncomment for deep debugging
    // ----------------------------------------------------

    // 6. Parse LLM Response
    let summaryJson: SummaryResponse;
    try {
      // Clean the response string: Remove potential markdown code fences
      const cleanedLlmResponseString = llmResponseString
        .replace(/^```json\s*|```$/g, "")
        .trim();
      summaryJson = JSON.parse(cleanedLlmResponseString);
      console.log("LLM response parsed successfully.");
    } catch (parseError) {
      console.error("Error parsing LLM response JSON:", parseError);
      console.error("LLM Response String (raw):", llmResponseString); // Log the raw response that failed parsing
      return NextResponse.json(
        { error: "Failed to parse summary from LLM response" },
        { status: 500 }
      );
    }

    // 7. Return Summary
    console.log("Returning summary to client.");
    return NextResponse.json(summaryJson, { status: 200 });
  } catch (error) {
    console.error("Error processing summarization request:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown internal error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
