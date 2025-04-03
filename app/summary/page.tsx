"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryPage() {
  const [redditUrl, setRedditUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSummary(null);
    setError(null);

    // --- Placeholder for actual API call ---
    console.log("Summarizing URL:", redditUrl);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success
    if (redditUrl.includes("reddit.com")) {
      // Basic validation
      setSummary(
        `This is a placeholder summary for the Reddit thread: ${redditUrl}. ` +
          `The actual implementation would fetch the thread content, process it, ` +
          `and generate a concise summary using an AI model. Key points and top comments would be highlighted.`
      );
    } else {
      setError("Invalid Reddit URL provided.");
    }
    // --- End Placeholder ---

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>
        </form>

        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {summary}
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex justify-center items-center pt-6">
            {/* Add a simple loading spinner or text */}
            <p className="text-muted-foreground">Loading summary...</p>
          </div>
        )}
      </div>
    </div>
  );
}
