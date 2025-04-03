import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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
              Choose the plan that works best for you. All plans include a 7-day
              free trial.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-muted-foreground">For casual Reddit users</p>
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
              <p className="text-muted-foreground">For Reddit enthusiasts</p>
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
              <p className="text-muted-foreground">For businesses & teams</p>
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
  );
}
