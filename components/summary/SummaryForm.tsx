"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { isValidRedditThreadUrl } from "@/lib/utils/redditUtils";

interface SummaryFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function SummaryForm({ onSubmit, isLoading }: SummaryFormProps) {
  const [redditUrl, setRedditUrl] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValidRedditThreadUrl(redditUrl)) {
      onSubmit(redditUrl);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
      <Button type="submit" disabled={isLoading} className="min-w-[120px]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Summarize"}
      </Button>
    </form>
  );
}
