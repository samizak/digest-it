"use client";

import { ModeToggle } from "@/components/ModeToggle";

export default function SimpleHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end mx-auto px-4 md:px-6">
        <ModeToggle />
      </div>
    </header>
  );
}
