"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import ProductCard from "../ui/product-card";
import type { Product } from "@/types/products.types";
import Link from "@/components/localized-link";

import "swiper/css";
import "swiper/css/pagination";

type HomeProductSliderProps = {
  className?: string;
  data: Product[];
};

export default function HomeProductSlider({
  className,
  data,
}: HomeProductSliderProps) {
  return (
    <div className={cn("min-w-0", className)}>
      {/* Mobile */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1.3}
          slidesPerGroup={1}
          spaceBetween={16}
          centeredSlides
          loop={data.length >= 3}
          watchOverflow
          pagination={{
            clickable: true,
            el: ".home-products-mobile-pagination",
            type: "bullets",
            bulletClass: "size-[5px] rounded-full cursor-pointer",
            bulletActiveClass: "!bg-primary-dark !w-8",
            renderBullet: (_index, bulletClass) =>
              `<span class="bg-[#C4C4C4] ${bulletClass}"></span>`,
          }}
          className="w-full !overflow-visible"
        >
          {data.map((item) => (
            <SwiperSlide
              key={item.id}
              className="
                [&>a>div>div:first-child]:!h-auto
                [&>a>div>div:first-child]:aspect-[266/203]
                [&>a>div>div:last-child]:!mt-[6px]
                [&>a>div>div:last-child]:min-h-[108px]
                [&>a>div>div:last-child]:!rounded-[3px]
                [&>a>div>div:last-child]:border
                [&>a>div>div:last-child]:border-[#FF656D]
                [&>a>div>div:last-child]:!p-[10px]
                [&_h3]:!text-[12px]
                [&_h3]:!text-[#C4000D]
                [&_p]:!text-[11px]
                [&_p]:leading-[18px]
              "
            >
              <Link
                href={`/products/${item.id}/${item.slug}`}
                className="block min-w-0"
              >
                <ProductCard
                  title={item.name}
                  description={item.description}
                  badges={item.badge}
                  image={item.image}
                />
              </Link>
            </SwiperSlide>
          ))}

          <div
            className="
              home-products-mobile-pagination !static
              mx-auto mt-6 flex w-fit
              items-center justify-center gap-[2.5px]
              [&.swiper-pagination-lock]:!hidden
            "
          />
        </Swiper>
      </div>

      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <Swiper
          modules={[Pagination]}
          slidesPerView={3}
          spaceBetween={20}
          watchOverflow
          breakpoints={{
            1024: {
              slidesPerView: 4,
            },
          }}
          pagination={{
            clickable: true,
            el: ".home-products-desktop-pagination",
            type: "bullets",
            bulletClass: "size-[5px] rounded-full cursor-pointer",
            bulletActiveClass: "!bg-primary-dark !w-10",
            renderBullet: (_index, bulletClass) =>
              `<span class="bg-[#D9D9D9] ${bulletClass}"></span>`,
          }}
          className="h-full w-full"
        >
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <Link
                href={`/products/${item.id}/${item.slug}`}
                className="block min-w-0"
              >
                <ProductCard
                  title={item.name}
                  description={item.description}
                  badges={item.badge}
                  image={item.image}
                />
              </Link>
            </SwiperSlide>
          ))}

          <div
            className="
              home-products-desktop-pagination !static
              mx-auto mt-6 flex w-fit
              items-center justify-center gap-[2.5px]
              [&.swiper-pagination-lock]:!hidden
            "
          />
        </Swiper>
      </div>
    </div>
  );
}