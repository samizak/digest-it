import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RssIcon as Reddit } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex gap-2 items-center text-xl font-bold">
          <Reddit className="h-6 w-6 text-orange-500" />
          <span>DigestIt</span>
        </div>

        <nav className="flex items-center space-x-4">
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
          <ModeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
