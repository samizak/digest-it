// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises"; // Node.js file system module (use promises version)
import path from "path"; // Node.js path module

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

export async function POST(request: Request) {
  console.log("Summarize API route hit");

  let requestBody: SummarizeRequestBody;
  let redditUrl: string;

  // 1. Parse Request Body and Get URL
  try {
    requestBody = await request.json();
    redditUrl = requestBody?.redditUrl ?? ""; // Use optional chaining and nullish coalescing

    if (!redditUrl) {
      console.error("Missing redditUrl in request body");
      return NextResponse.json(
        { error: "Missing redditUrl in request body" },
        { status: 400 }
      );
    }
    console.log("Received URL:", redditUrl);

    // Basic validation (could reuse the regex from frontend or improve)
    if (!/^https?:\/\/(www\.|old\.)?reddit\.com\/r\//i.test(redditUrl)) {
      console.error("Invalid Reddit URL format:", redditUrl);
      return NextResponse.json(
        { error: "Invalid Reddit URL format provided" },
        { status: 400 }
      );
    }
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
    //    - Implement logic here to fetch the JSON data for the `redditUrl`.
    //    - You might use the official Reddit API (requires auth) or a scraper (be careful with terms of service/IP bans).
    //    - Let's assume you get the data into a variable `redditJsonData`.
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
              selftext: "This is the post body from the API.",
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
                    body: "First comment text.",
                    score: 10,
                    replies: "" /* ... */,
                  },
                },
                {
                  kind: "t1",
                  data: {
                    author: "commenter2",
                    body: "Second comment text.",
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
    console.log("Placeholder: Reddit data fetched (using mock data).");
    // -------------------------------------------------------

    // 4. Inject Fetched Data into Prompt
    // Ensure the fetched data is stringified if it's an object/array
    const redditDataString = JSON.stringify(redditJsonData, null, 2); // Pretty print for readability in logs if needed
    const finalPrompt = promptTemplate.replace(
      "[INSERT REDDIT THREAD JSON DATA HERE]",
      redditDataString
    );
    console.log(
      "Final prompt created (first 200 chars):",
      finalPrompt.substring(0, 200) + "..."
    );

    // 5. --- PLACEHOLDER: Call LLM API ---
    //    - Implement logic here to send `finalPrompt` to your chosen LLM API (OpenAI, Gemini, Anthropic, etc.).
    //    - Use the appropriate SDK or fetch call.
    //    - Handle authentication (API keys stored securely, e.g., in environment variables).
    //    - Let's assume the LLM responds with a string containing the JSON object.
    console.log("Placeholder: Calling LLM API...");
    // Simulate LLM call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const llmResponseString = JSON.stringify({
      // Simulate the JSON output structure
      quickGlance: "This thread discusses X based on the mock API data.",
      stats: {
        op: redditJsonData.data.children[0].data.author,
        subreddit: redditJsonData.data.children[0].data.subreddit,
        created: new Date(
          redditJsonData.data.children[0].data.created_utc * 1000
        ).toISOString(),
        upvotes: `${redditJsonData.data.children[0].data.score}`,
        comments: redditJsonData.data.children[0].data.num_comments,
      },
      keyPoints: ["Mock point 1", "Mock point 2 from API data"],
      topComment: {
        text: redditJsonData.data.children[1].data.children[0].data.body,
        user: redditJsonData.data.children[1].data.children[0].data.author,
        votes: redditJsonData.data.children[1].data.children[0].data.score,
      },
      sentiment: "Mock sentiment: Positive.",
      links: [],
    });
    console.log(
      "Placeholder: LLM API response received (using mock response)."
    );
    // ----------------------------------------------------

    // 6. Parse LLM Response
    let summaryJson: SummaryResponse;
    try {
      summaryJson = JSON.parse(llmResponseString);
      console.log("LLM response parsed successfully.");
    } catch (parseError) {
      console.error("Error parsing LLM response JSON:", parseError);
      console.error("LLM Response String:", llmResponseString); // Log the raw response
      return NextResponse.json(
        { error: "Failed to parse summary from LLM" },
        { status: 500 }
      );
    }

    // 7. Return Summary
    console.log("Returning summary to client.");
    return NextResponse.json(summaryJson, { status: 200 });
  } catch (error) {
    console.error("Error processing summarization request:", error);
    // Log the specific error if needed
    // if (error instanceof Error) { console.error(error.message); }
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
