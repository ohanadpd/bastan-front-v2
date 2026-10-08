"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import Link from "@/components/localized-link";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type Props = {
  lang: string;
};

const slidesByLanguage = {
  fa: [
    {
      id: "fa-1",
      image: "/images/slider/fa/fa-1.jpg",
      href: "/products",
      alt: "محصولات کاشی باستان",
    },
    {
      id: "fa-2",
      image: "/images/slider/fa/fa-2.jpg",
      href: "/representatives",
      alt: "نمایندگی‌های باستان",
    },
  ],
  en: [
    {
      id: "en-1",
      image: "/images/slider/en/en1.jpg",
      href: "/products",
      alt: "Bastan tile products",
    },
    {
      id: "en-2",
      image: "/images/slider/en/en2.jpg",
      href: "/representatives",
      alt: "Bastan representatives",
    },
  ],
  ar: [
    {
      id: "ar-1",
      image: "/images/slider/ar/ar-1.jpg",
      href: "/products",
      alt: "منتجات بلاط باستان",
    },
    {
      id: "ar-2",
      image: "/images/slider/ar/ar-2.jpg",
      href: "/representatives",
      alt: "وكلاء باستان",
    },
  ],
};

export default function PromotionalSlider({ lang }: Props) {
  const language = lang === "en" || lang === "ar" ? lang : "fa";
  const slides = slidesByLanguage[language];

  return (
    <section className="container mt-[110px]">
      <Swiper
        key={language}
        modules={[Autoplay, EffectFade, Pagination]}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop={slides.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "promo-slider-bullet",
          bulletActiveClass: "promo-slider-bullet-active",
        }}
        className="promo-slider w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link
              href={slide.href}
              className="block overflow-hidden rounded-[10px]"
            >
              <div className="relative aspect-[3.7/1] w-full">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}