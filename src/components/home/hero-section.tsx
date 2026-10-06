"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Button } from "../ui/button";
import Link from "@/components/localized-link";
import { Trans } from "@lingui/react/macro";
import { HeaderProduct } from "@/types/home.types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    desktopImage: "/images/hero/slide-1-desktop.png",
    mobileImage: "/images/hero/slide-1-mobile.jpg",
  },
  {
    id: 2,
    desktopImage: "/images/hero/slide-2-desktop.jpg",
    mobileImage: "/images/hero/slide-2-mobile.jpg",
  },
];

interface Props {
  title: string;
  description: string;
  products: HeaderProduct[];
}

export default function HomeHeroSection({
  title,
  description,
  products,
}: Props) {
  return (
    <section className="relative w-full overflow-hidden" >
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: "#hero-pagination",
          bulletClass:
            "swiper-pagination-bullet !m-0 !h-[5px] !w-[5px] !rounded-full !bg-white/60 !opacity-100 transition-all",
          bulletActiveClass: "!w-[35px] !bg-white",
        }}
        className=" w-full h-[600px] md:h-[900px] xl:h-[750px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {/* Mobile */}
            <div className="relative h-full w-full md:hidden">
              <Image
                src={slide.mobileImage}
                alt="Bastan"
                fill
                priority={slide.id === 1}
                sizes="(max-width: 767px) 100vw, 1px"
                className="object-cover"
              />

              <div className="absolute bottom-[8%] left-1/2 z-20 -translate-x-1/2">
                <Link href="/products">
                  <Button className="h-[32px] min-w-[110px] rounded-[5px] bg-white px-[18px] text-[12px] font-medium text-[#C4000D] hover:bg-white">
                    <Trans>دیدن محصولات</Trans>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop */}
            <div className="relative hidden h-full w-full md:block">
              <Image
                src={slide.desktopImage}
                alt="Bastan"
                fill
                priority={slide.id === 1}
                sizes="(min-width: 768px) 100vw, 1px"
                className="object-cover"
              />

              <div className="absolute bottom-[5%] right-[25%] z-20">
                <Link href="/products">
                  <Button className="h-[38px] min-w-[130px] rounded-[5px] bg-white px-[18px] text-[13px] font-medium text-[#C4000D] hover:bg-white lg:h-[42px] lg:min-w-[150px] lg:text-[14px]">
                    <Trans>دیدن محصولات</Trans>
                  </Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        id="hero-pagination"
        className="absolute bottom-[12px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-[5px]"
      />
    </section>
  );
}