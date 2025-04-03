import {
  Clock,
  Sparkles,
  FileText,
  MessageSquare,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Cut through the noise
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              DigestIt uses advanced AI to extract the most valuable insights
              from Reddit threads, saving you time while keeping you in the
              loop.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <Clock className="h-10 w-10 text-orange-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Save Time</h3>
              <p className="text-muted-foreground">
                Get the key points from lengthy threads in seconds instead of
                scrolling for hours.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <Sparkles className="h-10 w-10 text-orange-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Our algorithm identifies the most valuable comments and
                organizes them by relevance.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <FileText className="h-10 w-10 text-orange-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Custom Digests</h3>
              <p className="text-muted-foreground">
                Tailor summaries to your interests and preferred reading length.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <MessageSquare className="h-10 w-10 text-orange-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Community Highlights</h3>
              <p className="text-muted-foreground">
                Never miss the best comments or most upvoted content from any
                thread.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-orange-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Fact Checking</h3>
              <p className="text-muted-foreground">
                Our system flags potentially misleading information to help you
                stay informed.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
            <ThumbsUp className="h-10 w-10 text-orange-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Sentiment Analysis</h3>
              <p className="text-muted-foreground">
                Understand the overall mood and consensus of any discussion at a
                glance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
