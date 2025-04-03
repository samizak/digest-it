import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Cta() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-500 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to save time on Reddit?
            </h2>
            <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of users who get the most out of Reddit without the
              endless scrolling.
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
  );
}
