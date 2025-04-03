"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string; // Allow passing additional classes
  delay?: number; // Optional delay
  y?: number; // Optional vertical offset
  duration?: number; // Optional duration
}

export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  y = 30, // Default slide-up amount
  duration = 0.6, // Default duration
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Set initial state (hidden, slightly shifted down)
    gsap.set(element, { opacity: 0, y: y });

    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: duration,
      delay: delay,
      ease: "power3.out", // Smoother easing
      scrollTrigger: {
        trigger: element,
        start: "top 85%", // Trigger when 85% of the element is visible
        end: "bottom 20%", // End point for scrubbing (optional)
        toggleActions: "play none none none", // Play animation once on enter
        // markers: true, // Uncomment for debugging trigger points
      },
    });

    // Cleanup function
    return () => {
      // Kill ScrollTrigger instance specifically
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      // Kill the animation itself
      animation.kill();
    };
  }, [delay, duration, y]); // Rerun effect if props change

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
