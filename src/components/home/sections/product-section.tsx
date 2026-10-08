"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Trans } from "@lingui/react/macro";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/types/home.types";
import HomeProductSlider from "@/components/home/product-slider";

interface ProductSectionTheme3Props {
  title?: string;
  description?: string;
  data: ProductCard[];
}

export default function ProductSection({
  title,
  description,
  data,
}: ProductSectionTheme3Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState<string>();

  const years = useMemo(
    () => Array.from(new Set(data.map((card) => card.year))),
    [data],
  );

  useEffect(() => {
    if (years.length > 0) {
      setActive(years[0]);
    }
  }, [years]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const products = useMemo(
    () =>
      data.filter((card) => card.year === active).map((card) => card.product),
    [active, data],
  );

  return (
    <section
      ref={sectionRef}
      className="
        mt-[120px] overflow-hidden bg-[#FDF6EE] py-[65px]
        max-md:mt-[60px] max-md:py-10
      "
    >
      <div className="container">
        <div
          className={cn(
            "flex flex-col items-center transition-all duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none",
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-16 opacity-0 motion-reduce:opacity-100",
          )}
        >
          <div className="w-fit">
            <h2 className="text-center text-[20px] font-bold text-[#252525] max-md:text-[16px]">
              {title}
            </h2>

            <div className="mt-[6px] h-[2px] w-full bg-primary" />
          </div>

          {description && (
            <p className="mt-[10px] text-center text-[13px] text-[#777777] max-md:mt-2 max-md:text-[11px]">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            "mt-[18px] flex flex-wrap items-center justify-center gap-[18px] transition-all delay-150 duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none max-md:gap-3",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0 motion-reduce:opacity-100",
          )}
        >
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setActive(year)}
              className={cn(
                "rounded-[16px] border px-[10px] py-[5px] text-[14px] transition-colors max-md:text-[11px]",
                active === year
                  ? "border-primary text-primary"
                  : "border-transparent text-[#555555] hover:text-primary",
              )}
            >
              <Trans>سال</Trans> {year}
            </button>
          ))}
        </div>

        {products.length > 0 && (
          <div
            className={cn(
              "min-w-0 transition-all delay-300 duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0 motion-reduce:opacity-100",
            )}
          >
            <HomeProductSlider
              className="mt-[45px] max-md:mt-8"
              data={products}
            />
          </div>
        )}
      </div>
    </section>
  );
}
