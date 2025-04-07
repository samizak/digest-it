"use client";

import { JSX, Key } from "react";
import { ArrowBigUp } from "lucide-react";
import AnimatedChunk from "@/components/AnimatedChunk";
import { SummaryData } from "@/lib/types/summaryTypes";

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
      <div className="bg-secondary/50 rounded-lg p-4 mt-2">
        <div className="space-y-2 pl-1">
          {data.keyPoints?.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-sm">•</span>
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </div>
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
      {/* Comment Box for Top Comment */}
      <div className="border rounded p-3 bg-muted/50 mt-2 not-prose">
        <p className="text-muted-foreground italic">
          "{data.topComment?.text}"
        </p>
        <p className="text-xs text-right pt-1 text-muted-foreground/80 flex items-center justify-end">
          {data.topComment?.user && data.topComment.user !== "[deleted]" ? (
            <a
              href={`https://www.reddit.com/user/${data.topComment.user.replace(
                "u/",
                ""
              )}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-primary"
            >
              {data.topComment.user}
            </a>
          ) : (
            <span>{data.topComment?.user || "[deleted]"}</span> // Fallback for missing or [deleted] user
          )}
          <span className="mx-1">|</span>
          <ArrowBigUp className="h-3.5 w-3.5 mr-0.5" />
          <span>{data.topComment?.votes}</span>
        </p>
      </div>
    </AnimatedChunk>
  ),
  // Chunk 4: Best Comment (New Chunk)
  (key: Key, data: SummaryData) => (
    <AnimatedChunk key={key} delay={0.1}>
      {/* Main Heading */}
      <h2 className="text-xl font-semibold pt-4 not-prose flex items-center gap-2">
        <span role="img" aria-label="star">
          ⭐
        </span>
        <span>Best Comment</span>
      </h2>
      {/* Comment Box for Best Comment */}
      {data.bestComment?.text ? (
        <div className="border rounded p-3 bg-muted/50 mt-2 not-prose">
          <p className="text-muted-foreground italic">
            "{data.bestComment.text}"
          </p>
          <p className="text-xs text-right pt-1 text-muted-foreground/80 flex items-center justify-end">
            {data.bestComment?.user && data.bestComment.user !== "[deleted]" ? (
              <a
                href={`https://www.reddit.com/user/${data.bestComment.user.replace(
                  "u/",
                  ""
                )}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-primary"
              >
                {data.bestComment.user}
              </a>
            ) : (
              <span>{data.bestComment?.user || "[deleted]"}</span> // Fallback
            )}
            <span className="mx-1">|</span>
            <ArrowBigUp className="h-3.5 w-3.5 mr-0.5" />
            <span>{data.bestComment.votes ?? "N/A"}</span>
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm mt-2">
          Best comment data not available.
        </p>
      )}
    </AnimatedChunk>
  ),
  // Chunk 5: Sentiment Analysis
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
  // Chunk 6: Links and Resources
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
    case "bestComment":
      return summaryChunks[4](index, data);
    case "sentiment":
      return summaryChunks[5](index, data);
    case "links":
      return summaryChunks[6](index, data);
    default:
      return null;
  }
};
