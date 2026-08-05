'use client';
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Trans, useLingui } from "@lingui/react/macro";
import "swiper/css";
import DesignCard from "./design-card";
import { msg } from "@lingui/core/macro";
import { Variant } from "@/types/products.types";
import { getMediaUrl } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Props {
  overview: string;
  variants: Variant[];
}

const OverviewSection: React.FC<Props> = ({ overview, variants }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { i18n } = useLingui();

  const tabs = [i18n._(msg`بررسی اجمالی`), i18n._(msg`طرح ها`), i18n._(msg`دکور`)];

  const handleTabClick = (index: number) => {
    if (swiperRef.current) {
      setActiveIndex(index);
      swiperRef.current.allowSlideNext = true;
      swiperRef.current.allowSlidePrev = true;

      swiperRef.current.slideTo(index, 300);

      swiperRef.current.allowSlideNext = false;
      swiperRef.current.allowSlidePrev = false;
    }
  };

  const handleDesignClick = (id: string) => {
    const params = new URLSearchParams(searchParams);

    const variantID = params.get('variant')
    if (variantID != id) {
      params.set('variant', id)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  }

  useEffect(() => {
    const element = document.getElementById("information-card");
    if (element) {
      if (isPending) {
        element.style.filter = "blur(2px)";
      } else {
        element.style.filter = "blur(0px)"
      }
    }
  }, [isPending])

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {tabs.map((tab, index) => (
          index == 2 && !variants.find(v => v.variant_type == 2) ? null :
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`h-8 px-2 rounded transition-colors text-sm ${activeIndex === index
                ? 'bg-primary text-white font-bold'
                : 'bg-transparent text-[#696969] hover:text-primary'
                }`}
            >
              {tab}
            </button>
        ))}
      </div>

      {/* Swiper */}
      <div className="w-full mt-8 xl:mt-9">
        <Swiper
          onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
          allowTouchMove={false}
          simulateTouch={false}
          allowSlideNext={false}
          allowSlidePrev={false}
          mousewheel={false}
          keyboard={false}
          autoHeight={true}
          className="w-full"
        >
          <SwiperSlide>
            <div className={`w-full transition-opacity duration-700 ease-linear ${activeIndex === 0 ? 'opacity-100' : 'opacity-0'
              }`}>
              <h2 className="text-xl font-bold mb-4">
                <Trans>
                  بررسی اجمالی
                </Trans>:
              </h2>
              <p className="text-[#424242]">
                {overview}
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`w-full transition-opacity duration-700 ease-linear ${activeIndex === 1 ? 'opacity-100' : 'opacity-0'
              }`}>
              <h2 className="text-xl font-bold mb-4">
                <Trans>
                  طرح ها
                </Trans>:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7 xl:gap-y-8">
                {variants.map((item) => (
                  item.variant_type == 1 && <DesignCard key={item.id}
                    image={getMediaUrl(item.image)}
                    title={item.variant_name}
                    dimensions={item.attribute_values?.find(v => v.attribute_name == "سایز" || v.attribute_name == "size")?.value}
                    alt={item.variant_name}
                    onClick={() => handleDesignClick(String(item.id))}
                  />
                ))}
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`w-full transition-opacity duration-700 ease-linear ${activeIndex === 2 ? 'opacity-100' : 'opacity-0'
              }`}>
              <h2 className="text-xl font-bold mb-4">
                <Trans>
                  دکور
                </Trans>:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7 xl:gap-y-8">
                {variants.map((item) => (
                  item.variant_type == 2 && <DesignCard key={item.id}
                    image={getMediaUrl(item.image)}
                    title={item.variant_name}
                    dimensions={item.attribute_values?.find(v => v.attribute_name == "سایز" || v.attribute_name == "size")?.value}
                    alt=" - "
                    onClick={() => handleDesignClick(String(item.id))}
                  />
                ))}
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default OverviewSection;