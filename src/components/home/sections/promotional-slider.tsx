"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import Link from "@/components/localized-link";
import { getMediaUrl } from "@/lib/utils";
import type { HomeBanner } from "@/types/home.types";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type Props = {
  lang: string;
  data: HomeBanner[];
};

export default function PromotionalSlider({ lang, data }: Props) {
  const language = lang === "en" || lang === "ar" ? lang : "fa";

  const slides = [...data]
    .filter((item) => item.publish && item.banner_image)
    .sort((a, b) => a.order - b.order);

  if (!slides.length) {
    return null;
  }

  return (
    <section
      className="container mt-[110px] h-[520px] xl:h-full"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <Swiper
        key={language}
        modules={[Autoplay, EffectFade, Pagination]}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop={slides.length > 1}
        autoplay={
          slides.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={
          slides.length > 1
            ? {
                clickable: true,
                bulletClass: "promo-slider-bullet",
                bulletActiveClass: "promo-slider-bullet-active",
              }
            : false
        }
        className="promo-slider w-full"
      >
        {slides.map((slide) => {
          const desktopImage = getMediaUrl(slide.banner_image);

          const tabletImage = getMediaUrl(
            slide.banner_image_tablet || slide.banner_image,
          );

          const mobileImage = getMediaUrl(
            slide.banner_image_mobile || slide.banner_image,
          );

          const picture = (
            <picture className="block">
              <source
                media="(max-width: 767px)"
                srcSet={mobileImage}
              />

              <source
                media="(max-width: 1279px)"
                srcSet={tabletImage}
              />

              <img
                src={desktopImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="block h-auto w-full md:aspect-[3.7/1] md:object-cover"
              />
            </picture>
          );

          return (
            <SwiperSlide key={slide.id}>
              {slide.link?.trim() ? (
                <Link
                  href={slide.link.trim()}
                  aria-label={
                    language === "en"
                      ? `View promotion ${slide.id}`
                      : language === "ar"
                        ? `عرض الإعلان ${slide.id}`
                        : `مشاهده بنر ${slide.id}`
                  }
                  className="block overflow-hidden rounded-[10px] xl:rounded-[20px]"
                >
                  {picture}
                </Link>
              ) : (
                <div className="block overflow-hidden rounded-[10px] xl:rounded-[20px]">
                  {picture}
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}