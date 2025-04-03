import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  RssIcon as Reddit,
  ThumbsUp,
} from "lucide-react";

export default function Hero() {
  return (
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
                  r/AskReddit - What's a small thing that makes your day better?
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
                        Morning coffee/tea rituals were mentioned by 200+ users
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
                      <span>Pets greeting them after work (120+ mentions)</span>
                    </li>
                    <li className="flex items-start">
                      <ThumbsUp className="mr-2 h-4 w-4 text-orange-500" />
                      <span>Finding money in old clothes (90+ mentions)</span>
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
  );
}
