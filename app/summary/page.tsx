"use client";

import { useState, useEffect, useRef, Key } from "react";
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

// Define Types for Mock Data (Optional but recommended)
interface StatsData {
  op: string;
  subreddit: string;
  created: string;
  upvotes: string;
  comments: number;
}
interface TopCommentData {
  text: string;
  user: string;
  votes: number;
}
interface LinkData {
  text: string;
  url: string;
}

// Mock Data Object
const mockData = {
  quickGlance: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam augue quis nulla cursus tristique. Etiam faucibus eros at commodo vestibulum. Fusce suscipit blandit nisi at varius. Sed et vehicula lectus. Duis faucibus justo at sodales consequat.`,
  stats: {
    op: "u/example_user",
    subreddit: "r/AskReddit",
    created: "2024-07-26 10:00 UTC",
    upvotes: "1.2k",
    comments: 458,
  } as StatsData,
  keyPoints: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Praesent aliquam augue quis nulla cursus tristique.",
    "Etiam faucibus eros at commodo vestibulum.",
    "Fusce suscipit blandit nisi at varius.",
  ],
  topComment: {
    text: "Sed et vehicula lectus. Duis faucibus justo at sodales consequat. Suspendisse id ligula augue. Pellentesque habitant morbi tristique senectus et netus.",
    user: "u/InsightfulUser",
    votes: 128,
  } as TopCommentData,
  sentiment:
    "Aliquam imperdiet nibh nec viverra malesuada. Aliquam gravida pellentesque ultrices. Nulla commodo fringilla pulvinar.",
  links: [
    { text: "Lorem ipsum link 1", url: "#" },
    { text: "Praesent aliquam link 2", url: "#" },
  ] as LinkData[],
};

// Define Summary Chunks (as functions returning JSX)
const summaryChunks = [
  // Chunk 0: Quick Glance
  (key: Key) => (
    <AnimatedChunk key={key}>
      <h2 className="text-xl font-semibold not-prose">
        <span role="img" aria-label="eyes">
          👀
        </span>{" "}
        Quick Glance
      </h2>
      <p className="text-muted-foreground">{mockData.quickGlance}</p>
    </AnimatedChunk>
  ),
  // Chunk 1: Thread Statistics
  (key: Key) => (
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
          {mockData.stats.op}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Subreddit:</span>{" "}
          {mockData.stats.subreddit}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Created:</span>{" "}
          {mockData.stats.created}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Upvotes:</span>{" "}
          {mockData.stats.upvotes}
        </div>
        <div>
          <span className="font-medium text-foreground/90">Comments:</span>{" "}
          {mockData.stats.comments}
        </div>
      </div>
    </AnimatedChunk>
  ),
  // Chunk 2: Key Points
  (key: Key) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="key">
          🔑
        </span>{" "}
        Key Points
      </h2>
      <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
        {mockData.keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </AnimatedChunk>
  ),
  // Chunk 3: Top Insights (Updated Styling)
  (key: Key) => (
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
          "{mockData.topComment.text}"
        </p>
        <p className="text-xs text-right pt-1 text-muted-foreground/80 flex items-center justify-end">
          <span>{mockData.topComment.user}</span>
          <span className="mx-1">|</span>
          <ArrowBigUp className="h-3.5 w-3.5 mr-0.5" />
          <span>{mockData.topComment.votes}</span>
        </p>
      </div>
    </AnimatedChunk>
  ),
  // Chunk 4: Sentiment Analysis
  (key: Key) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="thinking face">
          🤔
        </span>{" "}
        Sentiment Analysis
      </h2>
      <p className="text-muted-foreground">{mockData.sentiment}</p>
    </AnimatedChunk>
  ),
  // Chunk 5: Links and Resources
  (key: Key) => (
    <AnimatedChunk key={key} delay={0.1}>
      <h2 className="text-xl font-semibold pt-4 not-prose">
        <span role="img" aria-label="link">
          🔗
        </span>{" "}
        Links and Resources
      </h2>
      <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
        {mockData.links.map((link, index) => (
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

export default function SummaryPage() {
  const [redditUrl, setRedditUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [revealedChunks, setRevealedChunks] = useState<number[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Function to get the full text summary for copying (Uses mockData)
  const getFullSummaryText = (): string => {
    let text = `Quick Glance:
${mockData.quickGlance}

`;
    text += `Thread Statistics:
OP: ${mockData.stats.op}, Subreddit: ${mockData.stats.subreddit}, Created: ${mockData.stats.created}, Upvotes: ${mockData.stats.upvotes}, Comments: ${mockData.stats.comments}

`;
    text += `Key Points:
${mockData.keyPoints.map((p) => `- ${p}`).join("\n")}

`;
    text += `Top Comment (${mockData.topComment.user} | ${mockData.topComment.votes} votes):
"${mockData.topComment.text}"

`;
    text += `Sentiment Analysis:
${mockData.sentiment}

`;
    text += `Links:
${mockData.links.map((l) => `- ${l.text} (${l.url})`).join("\n")}
`;
    return text;
  };

  const handleCopy = () => {
    if (revealedChunks.length < summaryChunks.length) return;

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

  const handleSummarize = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmittedUrl(null);
    setIsCopied(false);
    setRevealedChunks([]);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsLoading(true);

    // Use the new validation function
    if (isValidRedditThreadUrl(redditUrl)) {
      const currentUrl = redditUrl;
      setSubmittedUrl(currentUrl);

      let delay = 300;
      const delayIncrement = 250;

      summaryChunks.forEach((_, index) => {
        const timeoutId = setTimeout(() => {
          setRevealedChunks((prev) => [...prev, index]);
          if (index === summaryChunks.length - 1) {
            setIsLoading(false);
          }
        }, delay);
        timeoutsRef.current.push(timeoutId);
        delay += delayIncrement;
      });
    } else {
      // Update error message for clarity
      setError(
        "Please paste a valid Reddit thread URL (e.g., www.reddit.com/r/subreddit/comments/...)"
      );
      setIsLoading(false);
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

          {isLoading && revealedChunks.length === 0 && (
            <div className="flex justify-center items-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">
                Generating summary...
              </p>
            </div>
          )}

          {revealedChunks.length > 0 && (
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
                          disabled={
                            isLoading ||
                            revealedChunks.length < summaryChunks.length
                          }
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
                {revealedChunks
                  .sort((a, b) => a - b)
                  .map((index) => summaryChunks[index](index))}
                {isLoading && revealedChunks.length > 0 && (
                  <div className="flex items-center justify-center pt-4 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading more...</span>
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
