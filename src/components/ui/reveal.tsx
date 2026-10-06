"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
};

export default function Reveal({
  children,
  direction = "up",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const hiddenPosition = {
  up: "translate-y-10",
  down: "-translate-y-36",
  left: "-translate-x-24",
  right: "translate-x-24",
}[direction];

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
        visible
          ? "translate-x-0 translate-y-0 opacity-100"
          : `${hiddenPosition} opacity-0 motion-reduce:opacity-100`
      }`}
    >
      {children}
    </div>
  );
}