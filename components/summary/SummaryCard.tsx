"use client";

import { useState, Key, JSX } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Copy, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SummaryData, SummaryDataKey } from "@/lib/types/summaryTypes";
import { truncateUrl } from "@/lib/utils/stringUtils";

interface SummaryCardProps {
  summaryData: SummaryData;
  submittedUrl: string | null;
  isLoading: boolean;
  revealedSections: string[];
  sectionOrder: SummaryDataKey[];
  renderChunk: (
    key: string,
    index: Key,
    data: SummaryData | null
  ) => JSX.Element | null;
}

export default function SummaryCard({
  summaryData,
  submittedUrl,
  isLoading,
  revealedSections,
  sectionOrder,
  renderChunk,
}: SummaryCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Move the getFullSummaryText function here
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

  return (
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
  );
}
