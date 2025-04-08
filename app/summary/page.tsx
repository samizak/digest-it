"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { SummaryData, SummaryDataKey } from "@/lib/types/summaryTypes";
import { renderChunk } from "@/components/summary/SummaryChunks";
import SummaryCard from "@/components/summary/SummaryCard";
import { HistoryProvider, useHistory } from "@/contexts/HistoryContext";
import HistoryPanel from "@/components/history/HistoryPanel";
import { HistoryEntry } from "@/lib/types/historyTypes";

const summarySchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

const sectionOrder: SummaryDataKey[] = [
  "quickGlance",
  "stats",
  "keyPoints",
  "topComment",
  "bestComment",
  "sentiment",
  "links",
];

function SummaryPageContent() {
  const { addHistoryEntry, selectedEntry, selectHistoryEntry } = useHistory();
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  const searchParams = useSearchParams();
  const [urlFromParams, setUrlFromParams] = useState<string | null>(null);
  const [currentSummaryData, setCurrentSummaryData] =
    useState<SummaryData | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [revealedSections, setRevealedSections] = useState<string[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      url: "",
    },
  });

  const getSummaryMutation = trpc.reddit.getSummaryFromUrl.useMutation();

  useEffect(() => {
    const url = searchParams.get("url");
    if (url) {
      setUrlFromParams(url);
      form.setValue("url", url);
      selectHistoryEntry(null);
      handleSubmit({ url });
    }
  }, [searchParams, form.setValue]);

  useEffect(() => {
    if (urlFromParams) {
      setCurrentSummaryData(null);
      setSubmittedUrl(null);
      setRevealedSections([]);
      setRevealIndex(0);
      getSummaryMutation.reset();
      selectHistoryEntry(null);
    }
  }, [urlFromParams]);

  useEffect(() => {
    if (
      !getSummaryMutation.isPending &&
      currentSummaryData &&
      revealIndex < sectionOrder.length
    ) {
      const currentKey = sectionOrder[revealIndex];
      const sectionData = currentSummaryData[currentKey];
      const shouldReveal =
        sectionData !== null &&
        sectionData !== undefined &&
        (!Array.isArray(sectionData) || sectionData.length > 0);

      if (shouldReveal) {
        const timer = setTimeout(() => {
          setRevealedSections((prev) => [...prev, currentKey]);
          setRevealIndex((prev) => prev + 1);
        }, 300);
        return () => clearTimeout(timer);
      }
      setRevealIndex((prev) => prev + 1);
    }
  }, [currentSummaryData, getSummaryMutation.isPending, revealIndex]);

  useEffect(() => {
    if (selectedEntry) {
      setCurrentSummaryData(selectedEntry.summary);
      setSubmittedUrl(selectedEntry.url);
      setRevealedSections(
        sectionOrder.filter(
          (key) =>
            selectedEntry.summary[key] !== null &&
            selectedEntry.summary[key] !== undefined &&
            (!Array.isArray(selectedEntry.summary[key]) ||
              (selectedEntry.summary[key] as any[]).length > 0)
        )
      );
      setRevealIndex(sectionOrder.length);
      form.setValue("url", selectedEntry.url);
      getSummaryMutation.reset();
    }
  }, [selectedEntry, form, getSummaryMutation]);

  const handleSubmit = useCallback(
    async (values: SummaryFormValues) => {
      console.log("Submitting URL:", values.url);
      setCurrentSummaryData(null);
      setSubmittedUrl(values.url);
      setRevealedSections([]);
      setRevealIndex(0);
      selectHistoryEntry(null);
      getSummaryMutation.reset();

      try {
        const result = await getSummaryMutation.mutateAsync({
          redditUrl: values.url,
        });
        console.log("Received summary data:", result);
        setCurrentSummaryData(result);

        const newEntry: HistoryEntry = {
          id: `${Date.now()}-${values.url}`,
          url: values.url,
          title: result.stats?.subreddit
            ? `${result.stats.subreddit} - ${result.stats.op || "Summary"}`
            : new URL(values.url).pathname.split("/")[2] || "Reddit Summary",
          timestamp: Date.now(),
          summary: result,
        };
        addHistoryEntry(newEntry);
      } catch (error) {
        console.error("Mutation failed:", error);
      }
    },
    [getSummaryMutation, addHistoryEntry, selectHistoryEntry]
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">DigestIt</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsHistoryPanelOpen(true)}
          aria-label="View History"
        >
          <History className="h-5 w-5" />
        </Button>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-2 mb-6"
      >
        <Input
          {...form.register("url")}
          placeholder="Paste Reddit thread URL (e.g., reddit.com/r/.../comments/...)"
          className="flex-grow"
          disabled={getSummaryMutation.isPending}
        />
        <Button
          type="submit"
          disabled={getSummaryMutation.isPending || !form.formState.isValid}
        >
          {getSummaryMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {getSummaryMutation.isPending ? "Summarizing..." : "Summarize"}
        </Button>
      </form>

      {form.formState.errors.url && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid URL</AlertTitle>
          <AlertDescription>
            {form.formState.errors.url.message}
          </AlertDescription>
        </Alert>
      )}

      {getSummaryMutation.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {getSummaryMutation.error.message ||
              "An unknown error occurred while fetching the summary."}
          </AlertDescription>
        </Alert>
      )}

      {(getSummaryMutation.isPending || currentSummaryData) && (
        <SummaryCard
          summaryData={currentSummaryData!}
          submittedUrl={submittedUrl}
          isLoading={getSummaryMutation.isPending}
          revealedSections={revealedSections}
          sectionOrder={sectionOrder}
          renderChunk={renderChunk}
        />
      )}

      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        onOpenChange={setIsHistoryPanelOpen}
      />
    </div>
  );
}

export default function SummaryPage() {
  return (
    <HistoryProvider>
      <SummaryPageContent />
    </HistoryProvider>
  );
}
