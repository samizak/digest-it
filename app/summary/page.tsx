"use client";

import { useState, useEffect, useRef } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SummaryData, SummaryDataKey } from "@/lib/types/summaryTypes";
import SummaryForm from "@/components/summary/SummaryForm";
import SummaryCard from "@/components/summary/SummaryCard";
import { renderChunk } from "@/components/summary/SummaryChunks";

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

  const getSummaryMutation = trpc.reddit.getSummaryFromUrl.useMutation();

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
    console.log(`Frontend: handleSummarize called with URL: '${redditUrl}'`);
    setError(null);
    setSubmittedUrl(null);
    setSummaryData(null);
    setRevealedSections([]);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsLoading(true);

    setSubmittedUrl(redditUrl);

    try {
      const summaryResult = await getSummaryMutation.mutateAsync({ redditUrl });

      console.log("Frontend: Received summary data:", summaryResult);
      setSummaryData(summaryResult);
    } catch (err: any) {
      console.error("Frontend: Caught error object:", err);
      const errorMessage =
        err?.message ||
        (err instanceof Error ? err.message : "An unknown error occurred");
      setError(errorMessage);
      setSubmittedUrl(null);
      setSummaryData(null);
    } finally {
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
            />
          )}
        </div>
      </main>
    </div>
  );
}
