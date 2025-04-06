"use client";

import { useState, useEffect, useRef } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SummaryData, SummaryDataKey } from "@/lib/types/summaryTypes";
import { isValidRedditThreadUrl } from "@/lib/utils/redditUtils";
import SummaryForm from "@/components/summary/SummaryForm";
import SummaryCard from "@/components/summary/SummaryCard";
import { renderChunk } from "@/components/summary/SummaryChunks";

// Define the order of sections to display
const sectionOrder: SummaryDataKey[] = [
  "quickGlance",
  "stats",
  "keyPoints",
  "topComment",
  "sentiment",
  "links",
];

export default function SummaryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [revealedSections, setRevealedSections] = useState<string[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Add tRPC hooks
  const getRedditJson = trpc.reddit.getRedditJson.useQuery(
    { redditUrl: submittedUrl || "" },
    { enabled: false } // Don't run automatically
  );
  
  const summarizeMutation = trpc.reddit.summarize.useMutation();

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

  const handleSummarize = async (redditUrl: string) => {
    setError(null);
    setSubmittedUrl(null);
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
      // Use tRPC to fetch Reddit JSON data
      const result = await getRedditJson.refetch();
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      const redditData = result.data;
      console.log("Frontend: Received Reddit JSON data");

      // Use tRPC to get the summary
      const summaryResult = await summarizeMutation.mutateAsync({
        redditUrl,
        redditData,
      });

      console.log("Frontend: Received summary data:", summaryResult);
      setSummaryData(summaryResult);
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

          <SummaryForm onSubmit={handleSummarize} isLoading={isLoading} />

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
            <SummaryCard
              summaryData={summaryData}
              submittedUrl={submittedUrl}
              isLoading={isLoading}
              revealedSections={revealedSections}
              sectionOrder={sectionOrder}
              renderChunk={renderChunk}
              getFullSummaryText={getFullSummaryText}
            />
          )}
        </div>
      </main>
    </div>
  );
}
