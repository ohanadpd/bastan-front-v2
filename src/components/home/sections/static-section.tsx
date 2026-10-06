"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface StaticSectionTheme3Props {
  data: {
    title?: string;
    description?: string;
    cards: {
      id: number;
      number: number;
      title: string;
    }[];
  };
}

const staticIcons = [
  "/images/static/icon-1.png",
  "/images/static/icon-2.png",
  "/images/static/icon-3.png",
  "/images/static/icon-4.png",
];

export default function StaticSectionTheme3({
  data,
}: StaticSectionTheme3Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frameId: number;
    const duration = 1800;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setProgress(1);
          return;
        }

        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = Math.min((currentTime - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          setProgress(eased);

          if (elapsed < 1) {
            frameId = requestAnimationFrame(animate);
          }
        };

        frameId = requestAnimationFrame(animate);
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const reversedCards = [...data.cards].reverse();

  return (
  <section ref={sectionRef} className="mt-[80px]">
    <div className="container">
      <div className="grid grid-cols-2 xl:flex xl:flex-row xl:items-center xl:justify-center">
        {reversedCards.map((item, index) => (
          <div
            key={item.id}
            className="
              relative flex h-[150px] w-full flex-col
              items-center justify-center border-[#E5E5E5]
              xl:max-w-[285px] xl:border-l last:border-l-0
              max-xl:h-[120px] max-xl:min-w-0 max-xl:px-2
            "
          >
            {index % 2 === 0 && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 end-0 top-0 w-px bg-[#E5E5E5] xl:hidden"
              />
            )}

            {index < Math.floor((reversedCards.length - 1) / 2) * 2 && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-[#E5E5E5] xl:hidden"
              />
            )}

            <Image
              src={staticIcons[index] || "/images/static/icon-1.png"}
              width={42}
              height={42}
              alt=""
              className="mb-[12px] max-xl:mb-2 max-xl:h-7 max-xl:w-7 max-xl:object-contain"
            />

            <span
              dir="ltr"
              className={`text-[38px] font-bold leading-none max-xl:text-[20px] max-xl:text-[#252525] ${
                index === 0 ? "text-[#C4000D]" : "text-[#252525]"
              }`}
            >
              +{Math.round(item.number * progress).toLocaleString("en-US")}
            </span>

            <span className="mt-3 text-center text-[16px] text-[#666666] max-xl:mt-2 max-xl:text-[12px]">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
}