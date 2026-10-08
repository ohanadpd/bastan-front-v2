"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { LogoBand } from "@/types/home.types";
import { getMediaUrl } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

export default function BrandsSectionTheme3({ data }: { data: LogoBand[] }) {
  const brands = data.filter((item) => item.logo);

  return (
    <section className="mt-[98px]">
      <div className="container">
        <div className="mb-[50px] flex flex-col items-center max-xl:mb-8">
          <div className="w-fit">
            <h2 className="text-[20px] font-bold text-black">همراهان ما</h2>

            <div className="mt-[2px] h-[2px] w-full bg-primary" />
          </div>

          <p className="mt-2 text-center text-[14px] text-[#868686]">
            برند های همراه باستان
          </p>
        </div>

        {/* Logos */}
        <div className="min-w-0" dir="rtl">
          <Swiper
            modules={[Pagination]}
            slidesPerView={2}
            slidesPerGroup={2}
            spaceBetween={24}
            watchOverflow
            centerInsufficientSlides
            breakpoints={{
              1280: {
                slidesPerView: 6,
                slidesPerGroup: 1,
                spaceBetween: 22,
              },
            }}
            pagination={{
              clickable: true,
              el: ".brands-pagination",
              type: "bullets",
              bulletClass: "size-[5px] rounded-full cursor-pointer",
              bulletActiveClass: "!bg-primary-dark !w-10",
              renderBullet: (_index, className) =>
                `<span class="bg-[#D9D9D9] ${className}"></span>`,
            }}
            className="w-full"
          >
            {brands.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="
                    mx-auto flex aspect-square w-full
                    items-center justify-center
                    rounded-[10px] border border-[#D3D3D3]
                    bg-white p-3 transition-all
                    hover:border-primary
                    xl:aspect-auto xl:h-[150px] xl:max-w-[150px]
                  "
                >همراهان
                  <div className="relative aspect-square w-full max-w-[100px] xl:max-w-[90px]">
                    <Image
                      src={getMediaUrl(item.logo)}
                      alt={item.alt || "brand"}
                      fill
                      sizes="(min-width: 1280px) 90px, 100px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div
              className="
                brands-pagination !static
                mx-auto mt-6 flex w-fit
                items-center justify-center gap-[2.5px]
                [&.swiper-pagination-lock]:!hidden
              "
            />
          </Swiper>
        </div>
      </div>
    </section>
  );
}
