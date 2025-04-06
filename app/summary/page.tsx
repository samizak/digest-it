"use client";

import { useState, useEffect, useRef, Key, JSX } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SimpleHeader from "@/components/SimpleHeader";
import { Loader2, Copy, Check, ArrowBigUp } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnimatedChunk from "@/components/AnimatedChunk";

// Helper function for truncation
const truncateUrl = (url: string, maxLength = 60): string => {
  if (url.length <= maxLength) {
    return url;
  }
  const start = url.substring(0, maxLength / 2);
  const end = url.substring(url.length - maxLength / 2);
  return `${start}...${end}`;
};

// Helper function for Reddit Thread URL Validation
const isValidRedditThreadUrl = (url: string): boolean => {
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
const extractRedditPostId = (url: string): string | null => {
  // Match the post ID from URLs like:
  // https://www.reddit.com/r/subreddit/comments/post_id/...
  const match = url.match(/\/comments\/([a-zA-Z0-9]+)/i);
  return match ? match[1] : null;
};

// Define Types for Mock Data (Optional but recommended)
interface StatsData {
  op?: string;
  subreddit?: string;
  created?: string;
  upvotes?: string;
  comments?: number;
}
interface TopCommentData {
  text?: string;
  user?: string;
  votes?: number;
}
interface LinkData {
  text: string;
  url: string;
}
interface SummaryData {
  quickGlance?: string;
  stats?: StatsData;
  keyPoints?: string[];
  topComment?: TopCommentData;
  sentiment?: string;
  links?: LinkData[];
}

// Mock Data Object
// const mockData = {
//   quickGlance: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam augue quis nulla cursus tristique. Etiam faucibus eros at commodo vestibulum. Fusce suscipit blandit nisi at varius. Sed et vehicula lectus. Duis faucibus justo at sodales consequat.`,
//   stats: {
//     op: "u/example_user",
//     subreddit: "r/AskReddit",
//     created: "2024-07-26 10:00 UTC",
//     upvotes: "1.2k",
//     comments: 458,
//   } as StatsData,
//   keyPoints: [
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "Praesent aliquam augue quis nulla cursus tristique.",
//     "Etiam faucibus eros at commodo vestibulum.",
//     "Fusce suscipit blandit nisi at varius.",
//   ],
//   topComment: {
//     text: "Sed et vehicula lectus. Duis faucibus justo at sodales consequat. Suspendisse id ligula augue. Pellentesque habitant morbi tristique senectus et netus.",
//     user: "u/InsightfulUser",
//     votes: 128,
//   } as TopCommentData,
//   sentiment:
//     "Aliquam imperdiet nibh nec viverra malesuada. Aliquam gravida pellentesque ultrices. Nulla commodo fringilla pulvinar.",
//   links: [
//     { text: "Lorem ipsum link 1", url: "#" },
//     { text: "Praesent aliquam link 2", url: "#" },
//   ] as LinkData[],
// };

// Define Summary Chunks (as functions returning JSX)
const summaryChunks = [
  // Chunk 0: Quick Glance
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key}>
      <h2 className="text-xl font-semibold not-prose">
        <span role="img" aria-label="eyes">
          👀
        </span>{" "}
        Quick Glance
      </h2>
      <p className="text-muted-foreground">{data.quickGlance}</p>
    </AnimatedChunk>
  ),
  // Chunk 1: Thread Statistics
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="bar chart">
          📊
        </span>{" "}
        Thread Statistics
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground not-prose">
        <div>
          <span className="font-medium text-foreground/90">OP:</span>{" "}
          {data.stats?.op}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Subreddit:</span>{" "}
          {data.stats?.subreddit}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Created:</span>{" "}
          {data.stats?.created}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Upvotes:</span>{" "}
          {data.stats?.upvotes}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Comments:</span>{" "}
          {data.stats?.comments}
        </div>
      </div>
    </AnimatedChunk>
  ),
  // Chunk 2: Key Points
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="key">
          🔑
        </span>{" "}
        Key Points
      </h2>
      <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
        {data.keyPoints?.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </AnimatedChunk>
  ),
  // Chunk 3: Top Insights (Updated Styling)
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key} delay={0.1}>
      {/* Main Heading */}
      <h2 className="text-xl font-semibold pt-4 not-prose flex items-center gap-2">
        <span role="img" aria-label="light bulb">
          💡
        </span>
        <span>Top Insights</span>
      </h2>
      {/* Sub Heading */}
      <h3 className="text-lg font-semibold mt-3 not-prose flex items-center gap-2">
        <span role="img" aria-label="speech bubble">
          💬
        </span>
        <span>Top Comment</span>
      </h3>
      {/* Comment Box */}
      <div className="border rounded p-3 bg-muted/50 mt-2 not-prose">
        <p className="text-muted-foreground italic">
          "{data.topComment?.text}"
        </p>
        <p className="text-xs text-right pt-1 text-muted-foreground/80 flex items-center justify-end">
          <span>{data.topComment?.user}</span>
          <span className="mx-1">|</span>
          <ArrowBigUp className="h-3.5 w-3.5 mr-0.5" />
          <span>{data.topComment?.votes}</span>
        </p>
      </div>
    </AnimatedChunk>
  ),
  // Chunk 4: Sentiment Analysis
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="thinking face">
          🤔
        </span>{" "}
        Sentiment Analysis
      </h2>
      <p className="text-muted-foreground">{data.sentiment}</p>
    </AnimatedChunk>
  ),
  // Chunk 5: Links and Resources
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="link">
          🔗
        </span>{" "}
        Links and Resources
      </h2>
      <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
        {data.links?.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </AnimatedChunk>
  ),
];

// Define the keys of SummaryData as a type for type safety
type SummaryDataKey = keyof SummaryData;

// Define the order of sections to display
const sectionOrder: SummaryDataKey[] = [
  "quickGlance",
  "stats",
  "keyPoints",
  "topComment",
  "sentiment",
  "links",
];

// Function to render the appropriate chunk based on section key
const renderChunk = (
  key: string,
  index: Key,
  data: SummaryData | null
): JSX.Element | null => {
  if (!data) return null;

  switch (key) {
    case "quickGlance":
      return summaryChunks[0](index, data);
    case "stats":
      return summaryChunks[1](index, data);
    case "keyPoints":
      return summaryChunks[2](index, data);
    case "topComment":
      return summaryChunks[3](index, data);
    case "sentiment":
      return summaryChunks[4](index, data);
    case "links":
      return summaryChunks[5](index, data);
    default:
      return null;
  }
};

export default function SummaryPage() {
  const [redditUrl, setRedditUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [revealedSections, setRevealedSections] = useState<string[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const getFullSummaryText = (): string => {
    if (!summaryData) return "";
    let text = `Quick Glance:\n${summaryData.quickGlance || "N/A"}\n\n`;
    if (summaryData.stats) {
      text += `Thread Statistics:\nOP: ${
        summaryData.stats.op || "N/A"
      }, Subreddit: ${summaryData.stats.subreddit || "N/A"}, Created: ${
        summaryData.stats.created || "N/A"
      }, Upvotes: ${summaryData.stats.upvotes || "N/A"}, Comments: ${
        summaryData.stats.comments ?? "N/A"
      }\n\n`;
    }
    if (summaryData.keyPoints && summaryData.keyPoints.length > 0) {
      text += `Key Points:\n${summaryData.keyPoints
        .map((p) => `- ${p}`)
        .join("\n")}\n\n`;
    }
    if (summaryData.topComment) {
      text += `Top Comment (${summaryData.topComment.user || "N/A"} | ${
        summaryData.topComment.votes ?? "N/A"
      } votes):\n"${summaryData.topComment.text || "N/A"}"\n\n`;
    }
    if (summaryData.sentiment) {
      text += `Sentiment Analysis:\n${summaryData.sentiment}\n\n`;
    }
    if (summaryData.links && summaryData.links.length > 0) {
      text += `Links:\n${summaryData.links
        .map((l) => `- ${l.text} (${l.url})`)
        .join("\n")}\n`;
    }
    return text.trim();
  };

  const handleCopy = () => {
    if (!summaryData) return;
    const textToCopy = getFullSummaryText();
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (summaryData) {
      setIsLoading(false);

      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setRevealedSections([]);

      let delay = 100;
      const delayIncrement = 200;

      sectionOrder.forEach((sectionKey) => {
        const sectionData = summaryData[sectionKey];
        // Check if data exists and is not an empty array
        if (
          sectionData &&
          !(Array.isArray(sectionData) && sectionData.length === 0)
        ) {
          const timeoutId = setTimeout(() => {
            setRevealedSections((prev) => [...prev, sectionKey]);
          }, delay);
          timeoutsRef.current.push(timeoutId);
          delay += delayIncrement;
        }
      });
    }
  }, [summaryData]);

  const handleSummarize = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmittedUrl(null);
    setIsCopied(false);
    setSummaryData(null);
    setRevealedSections([]);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsLoading(true);
  
    if (!isValidRedditThreadUrl(redditUrl)) {
      setError(
        "Please paste a valid Reddit thread URL (e.g., www.reddit.com/r/subreddit/comments/...)"
      );
      setIsLoading(false);
      return;
    }
  
    setSubmittedUrl(redditUrl);
  
    try {
      // First, fetch the raw Reddit JSON data
      console.log("Frontend: Fetching Reddit JSON data...");
      const redditJsonResponse = await fetch("/api/reddit-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redditUrl: redditUrl }),
      });
  
      if (!redditJsonResponse.ok) {
        const errorData = await redditJsonResponse
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        console.error("Frontend: Reddit JSON API Error:", errorData);
        throw new Error(
          errorData.error || `Reddit JSON API failed with status ${redditJsonResponse.status}`
        );
      }
  
      const redditData = await redditJsonResponse.json();
      console.log("Frontend: Received Reddit JSON data");
      
      // Now, send the Reddit data to the summarize API
      console.log("Frontend: Sending request to summarize API...");
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          redditUrl: redditUrl,
          redditData: redditData 
        }),
      });
  
      console.log("Frontend: Received response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        console.error("Frontend: API Error Response:", errorData);
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        );
      }
  
      const data: SummaryData = await response.json();
      console.log("Frontend: Received summary data:", data);
      setSummaryData(data); // Trigger the useEffect
    } catch (err) {
      console.error("Frontend: Error in summarize process:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setIsLoading(false);
      setSubmittedUrl(null);
      setSummaryData(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Reddit Thread Summarizer
          </h1>
          <p className="text-muted-foreground text-center">
            Paste the URL of a Reddit thread below to get a quick summary.
          </p>

          <form
            onSubmit={handleSummarize}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="url"
              placeholder="https://www.reddit.com/r/..."
              value={redditUrl}
              onChange={(e) => setRedditUrl(e.target.value)}
              required
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Summarize"
              )}
            </Button>
          </form>

          {error && <p className="text-red-500 text-center">Error: {error}</p>}

          {isLoading && !summaryData && (
            <div className="flex justify-center items-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">
                Generating summary...
              </p>
            </div>
          )}

          {summaryData && (
            <Card className="mt-6 overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle>Summary</CardTitle>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopy}
                          aria-label="Copy summary"
                          disabled={!summaryData}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isCopied ? "Copied!" : "Copy summary"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {submittedUrl && (
                  <CardDescription className="pt-1">
                    Original thread:
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={submittedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1.5 underline hover:text-primary text-xs break-all"
                          >
                            {truncateUrl(submittedUrl, 70)}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start">
                          <p className="max-w-xs break-all">{submittedUrl}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {sectionOrder
                  .filter((sectionKey) => revealedSections.includes(sectionKey))
                  .map((sectionKey) =>
                    renderChunk(sectionKey, sectionKey, summaryData)
                  )}
                {/* Optional: Loading indicator while sections are revealing */}
                {(isLoading ||
                  (summaryData &&
                    revealedSections.length <
                      sectionOrder.filter(
                        (key) =>
                          summaryData[key] &&
                          !(
                            Array.isArray(summaryData[key]) &&
                            (summaryData[key] as any[]).length === 0
                          )
                      ).length)) &&
                  revealedSections.length > 0 && (
                    <div className="flex items-center justify-center pt-4 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading sections...</span>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
