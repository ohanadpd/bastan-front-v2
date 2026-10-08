import Image from "next/image";
import { Trans } from "@lingui/react/macro";

import HomeContactForm from "@/components/home/contact-from";
import Reveal from "@/components/ui/reveal";
import Link from "@/components/localized-link";

import type { HomePageData } from "@/types/home.types";
import type { FAQ } from "@/types/terms.types";

import StaticSectionTheme from "../sections/static-section";
import BrandsSection from "../sections/brands-section";
import ProductSection from "../sections/product-section";
import NewsSectionTheme3 from "../sections/news-section";
import HomeHeroSection from "../hero-section";
import HomeAlbum from "../sections/home-album";
import FactoryProjectsSection from "../sections/factory-projects-section";
import PromotionalSlider from "../sections/promotional-slider";

interface PagePropsData extends HomePageData {
  faq: FAQ[];
}

interface HomeStyleProps {
  data: PagePropsData;
  lang: string;
}

export default function HomeStyle({ data, lang }: HomeStyleProps) {
  return (
    <main className="pb-[195px]">
      <HomeHeroSection products={data.header_products} />

      {data.static_section?.cards?.length > 0 && (
        <StaticSectionTheme data={data.static_section} />
      )}

      <div className="overflow-hidden pt-[104px]">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-[70px] xl:flex-row-reverse">
            <Reveal direction="right" className="w-full max-w-[520px]">
              <div className="flex flex-col items-center gap-[28px] xl:items-start">
                <h2 className="text-center text-[20px] font-bold text-[#252525] xl:text-start">
                  {data.body_text?.title}
                </h2>

                <p className="text-center text-[14px] leading-[2] text-[#666666] xl:text-start">
                  {data.body_text?.content}
                </p>

                <Link
                  href="/about-us"
                  className="flex h-[38px] w-[136px] items-center justify-center rounded-[5px] border border-primary text-[14px] text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <Trans>بیشتر بدانید</Trans>
                </Link>
              </div>
            </Reveal>

            <Reveal
              direction="left"
              className="hidden w-full max-w-[420px] xl:block"
            >
              <div className="relative h-[520px] w-full">
                <div className="absolute right-[-18px] top-[-14px] z-0 h-full w-full rounded-[4px] bg-[#F0DEC6]" />

                <div className="relative z-10 h-full w-full">
                  <Image
                    src={
                      lang === "en"
                        ? "/images/about-en.jpg"
                        : "/images/about-fa.jpg"
                    }
                    alt="Bastan"
                    fill
                    sizes="420px"
                    className="rounded-[4px] border border-primary object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {data.logo_bands?.length > 0 && (
        <Reveal direction="down">
          <BrandsSection data={data.logo_bands} />
        </Reveal>
      )}

      <HomeAlbum />

      {data.product_section?.cards?.length > 0 && (
        <ProductSection
          title={data.product_section.title}
          description={data.product_section.description}
          data={data.product_section.cards}
        />
      )}

      {/* <Reveal>
        <PromotionalSlider lang={lang} />
      </Reveal> */}

      <FactoryProjectsSection />

      {data.news_section?.cards?.length > 0 && (
        <NewsSectionTheme3
          title={data.news_section.title}
          description={data.news_section.description}
          data={data.news_section.cards}
        />
      )}

      {data.show_contact_us && (
        <section className="mt-20 py-14">
          <div className="container">
            <h2 className="text-xl font-bold text-[#252525]">
              <Trans>با ما در ارتباط بمانید</Trans>
            </h2>

            <span className="mt-2 text-center text-sm text-[#626262]">
              <Trans>ارتباط با کارخانه...</Trans>
            </span>

            <HomeContactForm textColor="#000000" />
          </div>
        </section>
      )}
    </main>
  );
}