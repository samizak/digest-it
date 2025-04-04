"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface AnimatedChunkProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
}

export default function AnimatedChunk({
  children,
  delay = 0,
  y = 15, // Smaller slide-up amount for chunks
  duration = 0.5,
}: AnimatedChunkProps) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;

    // Animate from hidden/shifted up to visible/original position
    gsap.fromTo(
      el.current,
      { opacity: 0, y: y },
      {
        opacity: 1,
        y: 0,
        delay: delay,
        duration: duration,
        ease: "power2.out",
      }
    );

    // No cleanup needed for simple 'fromTo' on mount animation
  }, [delay, duration, y]); // Dependencies ensure animation runs if props change (though unlikely here)

  return <div ref={el}>{children}</div>;
}
