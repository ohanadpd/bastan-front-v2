"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/localized-link";
import { NewsCard } from "@/types/home.types";
import { getMediaUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface NewsSectionTheme3Props {
  title?: string;
  description?: string;
  data: NewsCard[];
}

function Theme3NewsCard({
  title,
  image,
  href,
}: {
  title: string;
  image: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <div
        className="
          relative
          h-[225px]
          overflow-hidden
          rounded-[6px]
          lg:h-[235px]
        "
      >
        <Image
          src={getMediaUrl(image)}
          alt={title}
          fill
          sizes="(max-width: 1023px) 80vw, 50vw"
          className="
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
            motion-reduce:transition-none
          "
        />

        <div
          dir="rtl"
          className="
            absolute
            bottom-[10px]
            left-[14px]
            right-[14px]
            flex
            h-[48px]
            items-center
            justify-between
            rounded-full
            bg-white
            px-[12px]
            shadow-[0_2px_10px_rgba(0,0,0,0.05)]
            lg:h-[56px]
            lg:px-[14px]
          "
        >
          <span
            className="
              line-clamp-1
              min-w-0
              flex-1
              pr-[4px]
              text-right
              text-[14px]
              font-semibold
              text-[#252525]
              lg:text-[16px]
            "
          >
            {title}
          </span>

          <div
            className="
              flex
              h-[30px]
              w-[30px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-primary
              text-white
            "
          >
            <ArrowUpRight size={16} strokeWidth={2.4} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function NewsSectionTheme3({
  title,
  description,
  data,
}: NewsSectionTheme3Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = data.slice(0, 4);

  const columns = [
    "lg:col-span-5",
    "lg:col-span-7",
    "lg:col-span-7",
    "lg:col-span-5",
  ];

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
      {
        threshold: 0.12,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        overflow-hidden
        pb-[30px]
        pt-[44px]
        lg:pb-[70px]
        lg:pt-[120px]
      "
    >
      {/* Header */}
      <div className="container">
        <div
                className={`
          flex
          flex-col
          items-center
          transition-all
          duration-700
          ease-out
          motion-reduce:transform-none
          motion-reduce:transition-none
          ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-12 opacity-0 motion-reduce:opacity-100"
          }
        `}
        >
          <div className="w-fit">
            <h2
              className="
            text-center
            text-[17px]
            font-bold
            leading-[28px]
            text-[#252525]
            lg:text-[20px]
          "
            >
              {title}
            </h2>

            <div className="mt-[6px] h-[2px] w-full bg-primary" />
          </div>

          {description && (
            <p
              className="
                mt-[9px]
                text-center
                text-[12px]
                leading-[22px]
                text-[#7E7E7E]
                lg:mt-[10px]
                lg:text-[13px]
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div
        className={`
          mt-[32px]
          transition-all
          duration-700
          ease-out
          lg:hidden
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
      >
        <Swiper
          modules={[Pagination]}
          slidesPerView={1.22}
          slidesPerGroup={1}
          centeredSlides
          spaceBetween={16}
          speed={600}
          grabCursor
          loop={false}
          pagination={{
            clickable: true,
            el: ".news-theme3-pagination",
          }}
          className="!overflow-visible px-[24px]"
        >
          {items.map((item) => (
            <SwiperSlide key={item.news.pk}>
              <Theme3NewsCard
                title={item.news.name}
                image={item.news.image}
                href={`/news/${item.news.pk}/${item.news.slug}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="news-theme3-pagination mt-[14px] flex items-center justify-center" />
      </div>
      {/* ================= DESKTOP ================= */}
      <div className="container hidden lg:block">
        <div className="mt-[38px] grid grid-cols-12 gap-[14px]">
          {items.map((item, index) => (
            <div
              key={item.news.pk}
              className={`
                ${columns[index]}
                transition-all
                duration-700
                ease-out
                motion-reduce:transform-none
                motion-reduce:transition-none
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : index % 2 === 0
                      ? "-translate-x-16 opacity-0 motion-reduce:opacity-100"
                      : "translate-x-16 opacity-0 motion-reduce:opacity-100"
                }
              `}
              style={{
                transitionDelay: `${150 + index * 130}ms`,
              }}
            >
              <Theme3NewsCard
                title={item.news.name}
                image={item.news.image}
                href={`/news/${item.news.pk}/${item.news.slug}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
