"use client";

import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import Link from "@/components/localized-link";
import { getMediaUrl } from "@/lib/utils";
import type { HeaderProduct } from "@/types/home.types";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Props {
  products: HeaderProduct[];
}

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-tablet": string;
  "--banner-mobile": string;
};

export default function HomeHeroSection({ products }: Props) {
  const slides = [...products]
    .filter((item) => item.banner_image)
    .sort((a, b) => a.order - b.order);

  if (!slides.length) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        loop={slides.length > 1}
        autoplay={
          slides.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{
          clickable: true,
          el: ".home-hero-pagination",
          bulletClass: "home-hero-bullet",
          bulletActiveClass: "home-hero-bullet-active",
        }}
        className="h-[600px] w-full md:h-[900px] xl:h-[750px]"
      >
        {slides.map((slide) => {
          const desktopImage = getMediaUrl(slide.banner_image);

          const mobileImage = slide.banner_image_mobile
            ? getMediaUrl(slide.banner_image_mobile)
            : desktopImage;

          const tabletImage = slide.banner_image_tablet
            ? getMediaUrl(slide.banner_image_tablet)
            : desktopImage;

          const bannerStyle: BannerStyle = {
            "--banner-desktop": `url("${desktopImage}")`,
            "--banner-tablet": `url("${tabletImage}")`,
            "--banner-mobile": `url("${mobileImage}")`,
          };

          return (
            <SwiperSlide key={slide.id}>
              <Link
                href="/products"
                aria-label="مشاهده محصولات"
                style={bannerStyle}
                className="
                  block h-full w-full bg-cover bg-center
                  [background-image:var(--banner-mobile)]
                  md:[background-image:var(--banner-tablet)]
                  xl:[background-image:var(--banner-desktop)]
                "
              >
                <span className="sr-only">مشاهده محصولات</span>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        dir="ltr"
        className="home-hero-pagination !absolute !bottom-6 !left-1/2 z-30 flex !w-auto -translate-x-1/2 items-center justify-center gap-[5px]"
      />
    </section>
  );
}
