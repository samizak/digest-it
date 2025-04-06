"use client";

import { JSX, Key } from "react";
import { ArrowBigUp } from "lucide-react";
import AnimatedChunk from "@/components/AnimatedChunk";
import { SummaryData } from "@/lib/types/summaryTypes";

// Define Summary Chunks (as functions returning JSX)
export const summaryChunks = [
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

// Function to render the appropriate chunk based on section key
export const renderChunk = (
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
