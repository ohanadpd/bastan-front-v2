"use client";

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
      mobileImage: "/images/slider/mobile/fa/kashef-fa.jpg",
      href: "/products",
      alt: "محصولات کاشی باستان",
    },
    {
      id: "fa-2",
      image: "/images/slider/fa/fa-2.jpg",
      mobileImage: "/images/slider/mobile/fa/nama-fa.jpg",
      href: "/representatives",
      alt: "نمایندگی‌های باستان",
    },
    {
      id: "fa-3",
      image: "/images/slider/fa/fa-3.jpg",
      mobileImage: "/images/slider/mobile/fa/pevest-fa.jpg",
      href: "/representatives",
      alt: "نمایندگی‌های باستان",
    },
  ],
  en: [
    {
      id: "en-1",
      image: "/images/slider/en/en1.jpg",
      mobileImage: "/images/slider/mobile/en/kashef-en.jpg",
      href: "/products",
      alt: "Bastan tile products",
    },
    {
      id: "en-2",
      image: "/images/slider/en/en2.jpg",
      mobileImage: "/images/slider/mobile/en/nama-en.jpg",
      href: "/representatives",
      alt: "Bastan representatives",
    },
    {
      id: "en-3",
      image: "/images/slider/en/en-3.jpg",
      mobileImage: "/images/slider/mobile/en/pevest-en.jpg",
      href: "/representatives",
      alt: "Bastan representatives",
    },
  ],
  ar: [
    {
      id: "ar-1",
      image: "/images/slider/ar/ar-1.jpg",
      mobileImage: "/images/slider/mobile/ar/kashef-ar.jpg",
      href: "/products",
      alt: "منتجات بلاط باستان",
    },
    {
      id: "ar-2",
      image: "/images/slider/ar/ar-2.jpg",
      mobileImage: "/images/slider/mobile/ar/nama-ar.jpg",
      href: "/representatives",
      alt: "وكلاء باستان",
    },
    {
      id: "ar-3",
      image: "/images/slider/ar/ar-3.jpg",
      mobileImage: "/images/slider/mobile/ar/pevest-ar.jpg",
      href: "/representatives",
      alt: "وكلاء باستان",
    },
  ],
};

export default function PromotionalSlider({ lang }: Props) {
  const language = lang === "en" || lang === "ar" ? lang : "fa";
  const slides = slidesByLanguage[language];

  return (
    <section className="container mt-[110px] h-[520px] xl:h-full">
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
              className="block overflow-hidden rounded-[10px]  xl:rounded-[20px]"
            >
              <picture className="block">
                <source
                  media="(max-width: 767px)"
                  srcSet={slide.mobileImage}
                />

                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full md:aspect-[3.7/1] md:object-cover"
                />
              </picture>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}