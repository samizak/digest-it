import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  RssIcon as Reddit,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Reddit className="h-6 w-6 text-orange-500" />
            <span>DigestIt</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                FAQ
              </Link>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Log in
              </Button>
              <Button size="sm">Sign up</Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Reddit Threads Summarized in Seconds
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    DigestIt transforms lengthy Reddit discussions into concise,
                    easy-to-read summaries. Save time while staying informed.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Free Trial</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border bg-background shadow-xl">
                  <div className="flex items-center border-b px-4 py-3">
                    <Reddit className="mr-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm font-medium">
                      r/AskReddit - What's a small thing that makes your day
                      better?
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Summary of 1,243 comments
                        </div>
                        <div className="text-sm font-medium">Key Points:</div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <ThumbsUp className="mr-2 h-4 w-4 text-orange-500" />
                          <span>
                            Morning coffee/tea rituals were mentioned by 200+
                            users
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ThumbsUp className="mr-2 h-4 w-4 text-orange-500" />
                          <span>
                            Random compliments from strangers (150+ mentions)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ThumbsUp className="mr-2 h-4 w-4 text-orange-500" />
                          <span>
                            Pets greeting them after work (120+ mentions)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ThumbsUp className="mr-2 h-4 w-4 text-orange-500" />
                          <span>
                            Finding money in old clothes (90+ mentions)
                          </span>
                        </li>
                      </ul>
                      <div className="pt-2">
                        <div className="text-sm font-medium">Top Comment:</div>
                        <p className="text-sm text-muted-foreground">
                          "When my cat waits by the door for me to come home and
                          then follows me around the house purring."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to stay informed, without the noise
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  DigestIt uses advanced AI to extract the most valuable
                  insights from Reddit threads, saving you time while keeping
                  you in the loop.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Clock className="h-10 w-10 text-orange-500" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Save Time</h3>
                  <p className="text-muted-foreground">
                    Get the key points from lengthy threads in seconds instead
                    of scrolling for hours.
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
                    Tailor summaries to your interests and preferred reading
                    length.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <MessageSquare className="h-10 w-10 text-orange-500" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Community Highlights</h3>
                  <p className="text-muted-foreground">
                    Never miss the best comments or most upvoted content from
                    any thread.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-orange-500" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Fact Checking</h3>
                  <p className="text-muted-foreground">
                    Our system flags potentially misleading information to help
                    you stay informed.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <ThumbsUp className="h-10 w-10 text-orange-500" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Sentiment Analysis</h3>
                  <p className="text-muted-foreground">
                    Understand the overall mood and consensus of any discussion
                    at a glance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  DigestIt works in three simple steps to transform lengthy
                  Reddit threads into concise summaries.
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
                    Simply copy and paste the URL of any Reddit thread you want
                    to summarize.
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
                    Our AI reads and analyzes all comments, identifying key
                    points and valuable insights.
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
                    Receive a concise, organized summary of the thread in
                    seconds, ready to read.
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

        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for you. All plans include a
                  7-day free trial.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">
                    For casual Reddit users
                  </p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $0
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    /month
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>5 summaries per day</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic summary format</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Web access only</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-8">
                  Get Started
                </Button>
              </div>
              <div className="relative flex flex-col rounded-lg border-2 border-orange-500 bg-background p-6 shadow-sm">
                <div className="absolute -top-4 right-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">
                    For Reddit enthusiasts
                  </p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $4.99
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    /month
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited summaries</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced summary formats</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Save favorite summaries</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>No ads</span>
                  </li>
                </ul>
                <Button className="mt-8 bg-orange-500 hover:bg-orange-600">
                  Start Free Trial
                </Button>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Team</h3>
                  <p className="text-muted-foreground">
                    For businesses & teams
                  </p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $12.99
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    /month
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>5 team members</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Team sharing features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-8">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Frequently asked questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about DigestIt.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl gap-4 py-12">
              {[
                {
                  question: "How accurate are the summaries?",
                  answer:
                    "Our AI is trained to extract the most relevant information with high accuracy. Summaries include the most upvoted and engaged-with content, ensuring you get the most valuable insights from any thread.",
                },
                {
                  question: "Can I summarize any subreddit?",
                  answer:
                    "Yes, DigestIt works with any public subreddit and thread. Some quarantined subreddits may have limited functionality.",
                },
                {
                  question: "How long does it take to generate a summary?",
                  answer:
                    "Most summaries are generated in under 10 seconds, though very large threads (10,000+ comments) may take up to 30 seconds to process.",
                },
                {
                  question: "Can I customize the summary length?",
                  answer:
                    "Yes, Pro and Team users can adjust summary length from brief overviews to comprehensive digests, depending on your needs.",
                },
                {
                  question: "Is there a browser extension?",
                  answer:
                    "Yes, we offer Chrome and Firefox extensions that allow you to summarize threads directly while browsing Reddit.",
                },
                {
                  question: "How do I cancel my subscription?",
                  answer:
                    "You can cancel anytime from your account settings. Your access will continue until the end of your billing period.",
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg border p-6">
                  <h3 className="text-lg font-bold">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-500 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to save time on Reddit?
                </h2>
                <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who get the most out of Reddit without
                  the endless scrolling.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1 bg-white/10 text-white placeholder:text-white/60 border-white/20 focus-visible:ring-white"
                  />
                  <Button
                    type="submit"
                    className="bg-white text-orange-500 hover:bg-white/90"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-white/80">
                  7-day free trial, no credit card required.{" "}
                  <Link href="/terms" className="underline underline-offset-2">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex gap-2 items-center text-lg font-bold">
            <Reddit className="h-6 w-6 text-orange-500" />
            <span>DigestIt</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DigestIt. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
