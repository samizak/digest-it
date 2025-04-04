"use client";

import { useState } from "react";
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

export default function SummaryPage() {
  const [redditUrl, setRedditUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const quickGlance = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam augue quis nulla cursus tristique. Etiam faucibus eros at commodo vestibulum. Fusce suscipit blandit nisi at varius. Sed et vehicula lectus. Duis faucibus justo at sodales consequat. Suspendisse id ligula augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam imperdiet nibh nec viverra malesuada. Aliquam gravida pellentesque ultrices.`;

  const mockSummary = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam augue quis nulla cursus tristique. Etiam faucibus eros at commodo vestibulum. Fusce suscipit blandit nisi at varius. Sed et vehicula lectus. Duis faucibus justo at sodales consequat. Suspendisse id ligula augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam imperdiet nibh nec viverra malesuada. Aliquam gravida pellentesque ultrices.

Aliquam erat volutpat. Pellentesque urna metus, feugiat id elit sed, tempor scelerisque nisl. Vestibulum non orci nulla. Maecenas id augue ligula. Cras risus dolor, malesuada non convallis et, porta et justo. Pellentesque auctor sem quis tellus convallis, nec interdum ante viverra. Nam viverra urna vel nunc tempor gravida. In accumsan leo vitae diam vestibulum aliquet. Interdum et malesuada fames ac ante ipsum primis in faucibus.
Fusce aliquam augue vel condimentum efficitur. Phasellus feugiat tortor eget purus cursus, vitae lacinia turpis hendrerit. Aenean iaculis euismod sagittis. Aliquam suscipit odio quis suscipit ultricies. Nullam elit diam, mollis ac convallis vitae, malesuada at dolor. Etiam finibus nibh at molestie egestas. Nulla semper metus vel ex convallis sagittis. In iaculis velit non tellus tincidunt, id ultricies neque imperdiet. Etiam sed euismod ipsum, eu accumsan urna. Ut porttitor consequat auctor. Etiam eget magna vel erat fermentum sagittis lacinia eget enim.

Ut tellus sem, dapibus nec finibus vitae, mattis et tellus. Praesent efficitur bibendum tortor, eu blandit risus fringilla ac. Aliquam hendrerit ornare turpis, et varius quam consequat id. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce dictum rutrum consectetur. Morbi non quam sed ante elementum condimentum ac sed diam. Nam maximus, eros in tempor pharetra, orci elit vulputate mauris, ut semper neque tellus vel nibh. Morbi commodo hendrerit lectus, a viverra turpis pretium eget. Suspendisse ex velit, consequat sit amet dignissim a, finibus sed nunc. Suspendisse ut faucibus orci, non ultrices arcu. Donec vel turpis enim. Vestibulum pulvinar sit amet purus ac laoreet. Maecenas molestie ligula mauris, sit amet lobortis ligula sagittis at. Integer porttitor, lorem non semper egestas, nulla enim facilisis elit, eget tincidunt erat mauris nec augue. Aenean finibus laoreet nisl sed vehicula.

Suspendisse ut nunc lectus. Proin quis risus tristique, consequat ligula vitae, egestas risus. Sed euismod turpis eros, ut porta ipsum aliquam quis. Fusce lobortis hendrerit tortor non aliquet. Morbi lobortis mattis purus et ornare. In nec condimentum lacus, vitae eleifend lorem. Sed rhoncus urna id fermentum rutrum. Vestibulum sit amet nisi molestie, scelerisque nulla id, pharetra turpis.

Nulla commodo fringilla pulvinar. Maecenas a est condimentum, tempor dolor dapibus, egestas odio. Nullam varius leo eu enim lobortis, id posuere mi condimentum. Praesent non risus ut ligula ullamcorper egestas. Duis gravida nisl metus, in rutrum magna dictum in. Cras id condimentum purus. Ut vitae neque id ipsum cursus commodo. Nunc gravida purus eu purus eleifend, sed aliquam ex malesuada. Integer sed odio ullamcorper, posuere purus ac, commodo nisi. Praesent molestie ex ac tellus ornare dictum. Vivamus mollis iaculis est, et elementum massa convallis sit amet. Vivamus consectetur massa ligula, quis faucibus nibh semper vel.
`;

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard
        .writeText(summary)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleSummarize = (event: React.FormEvent) => {
    event.preventDefault();
    setSummary(null);
    setError(null);
    setSubmittedUrl(null);
    setIsCopied(false);
    setIsLoading(true);

    const isValidRedditUrl = redditUrl.includes("reddit.com/r/");

    if (isValidRedditUrl) {
      const currentUrl = redditUrl;
      setTimeout(() => {
        setSummary(mockSummary);
        setSubmittedUrl(currentUrl);
        setIsLoading(false);
      }, 3000);
    } else {
      setError(
        "Please provide a valid Reddit thread URL (e.g., reddit.com/r/...)."
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

          {isLoading && (
            <div className="flex justify-center items-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">
                Generating summary...
              </p>
            </div>
          )}

          {summary && !isLoading && submittedUrl && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle>Summary</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    aria-label="Copy summary"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription className="pt-1">
                  Original thread:
                  <Link
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:text-primary text-xs break-all"
                  >
                    {submittedUrl}
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <h2 className="text-xl font-semibold">
                  <span role="img" aria-label="eyes">
                    👀
                  </span>{" "}
                  Quick Glance
                </h2>
                <p className="text-muted-foreground">{quickGlance}</p>

                <h2 className="text-xl font-semibold pt-4">
                  <span role="img" aria-label="key">
                    🔑
                  </span>{" "}
                  Key Points
                </h2>
                <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                </ul>

                <h2 className="text-xl font-semibold pt-4">
                  <span role="img" aria-label="light bulb">
                    💡
                  </span>{" "}
                  Top Insights
                </h2>
                <h3 className="text-lg font-semibold">
                  <span role="img" aria-label="speech bubble">
                    💬
                  </span>{" "}
                  Top Comment
                </h3>
                <div className="border rounded p-3 bg-muted/50">
                  <p className="text-muted-foreground italic">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent aliquam augue quis nulla cursus tristique. Etiam
                    faucibus eros at commodo vestibulum. Fusce suscipit blandit
                    nisi at varius. Sed et vehicula lectus. Duis faucibus justo
                    at sodales consequat. Suspendisse id ligula augue.
                    Pellentesque habitant morbi tristique senectus et netus et
                    malesuada fames ac turpis egestas. Aliquam imperdiet nibh
                    nec viverra malesuada. Aliquam gravida pellentesque
                    ultrices."
                  </p>
                  <p className="text-xs text-right pt-1 text-muted-foreground/80 flex items-center justify-start">
                    <span>u/reddituser</span>
                    <span className="mx-1">|</span>
                    <ArrowBigUp className="h-3.5 w-3.5 mr-0.5" />
                    <span>94</span>
                  </p>
                </div>

                <h2 className="text-xl font-semibold pt-4">
                  <span role="img" aria-label="link">
                    🔗
                  </span>{" "}
                  Links and Resources
                </h2>
                <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </li>
                </ul>

                <h2 className="text-xl font-semibold pt-4">
                  <span role="img" aria-label="thinking face">
                    🤔
                  </span>{" "}
                  Sentiment Analysis
                </h2>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Praesent aliquam augue quis nulla cursus tristique. Etiam
                  faucibus eros at commodo vestibulum. Fusce suscipit blandit
                  nisi at varius. Sed et vehicula lectus. Duis faucibus justo at
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
