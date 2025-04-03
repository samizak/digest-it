import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RssIcon as Reddit } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Simple, fast, and effective
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              DigestIt works in three simple steps to transform lengthy Reddit
              threads into concise summaries.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="relative flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
              1
            </div>
            <div className="pt-4 space-y-2">
              <h3 className="text-xl font-bold">Paste the Thread URL</h3>
              <p className="text-muted-foreground">
                Simply copy and paste the URL of any Reddit thread you want to
                summarize.
              </p>
            </div>
          </div>
          <div className="relative flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
              2
            </div>
            <div className="pt-4 space-y-2">
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI reads and analyzes all comments, identifying key points
                and valuable insights.
              </p>
            </div>
          </div>
          <div className="relative flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
              3
            </div>
            <div className="pt-4 space-y-2">
              <h3 className="text-xl font-bold">Get Your Digest</h3>
              <p className="text-muted-foreground">
                Receive a concise, organized summary of the thread in seconds,
                ready to read.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border bg-background p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Reddit className="h-5 w-5 text-orange-500" />
                <div className="text-sm font-medium">Try it now</div>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Input
                  placeholder="Paste Reddit thread URL here"
                  className="flex-1"
                  defaultValue="https://www.reddit.com/r/AskReddit/comments/example"
                />
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Digest It <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
