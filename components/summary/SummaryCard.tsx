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
  getFullSummaryText: () => string;
}

export default function SummaryCard({
  summaryData,
  submittedUrl,
  isLoading,
  revealedSections,
  sectionOrder,
  renderChunk,
  getFullSummaryText,
}: SummaryCardProps) {
  const [isCopied, setIsCopied] = useState(false);

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
  );
}
