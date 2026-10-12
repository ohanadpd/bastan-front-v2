"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";

import { cn, toPersianDate } from "@/lib/utils";
import type { Achivment } from "@/types/about-us.types";

import "swiper/css";
import "swiper/css/pagination";

type AchievementsSliderProps = {
  className?: string;
  data: Achivment[];
};

export default function AchievementsSlider({
  className,
  data,
}: AchievementsSliderProps) {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      watchOverflow
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
      }}
      pagination={{
        clickable: true,
        bulletClass: "achievements-bullet",
        bulletActiveClass: "achievements-bullet-active",
      }}
      className={cn("achievements-slider w-full", className)}
    >
      {data.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="group  flex flex-col gap-[6px]">
            <div className="relative aspect-[226/320] w-full overflow-hidden rounded-[4px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="
                  (min-width: 1280px) 25vw,
                  (min-width: 1024px) 33vw,
                  (min-width: 768px) 50vw,
                  100vw
                "
                className="object-contain"
              />
            </div>

            <div className="rounded-[5px] border-[0.5px] border-[#BFBFBF] bg-white px-2 py-2 text-start transition-colors duration-300 group-hover:border-primary">
            <h3 className="text-[14px] font-bold leading-6 text-black transition-colors duration-300 group-hover:text-primary">
                {item.title}
            </h3>

            {item.date && (
                <span className="mt-1 block text-[12px] text-[#595959] transition-colors duration-300 ">
                {toPersianDate(item.date)}
                </span>
            )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}