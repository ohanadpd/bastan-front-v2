import Image from "next/image";

import { Trans } from "@lingui/react/macro";

import HomeContactForm from "@/components/home/contact-from";

import { fetchHomePage } from "@/lib/services/home.services";
import { fetchTermsPage } from "@/lib/services/terms.services";
import { HomePageData } from "@/types/home.types";
import { FAQ, TermsPageData } from "@/types/terms.types";

import Reveal from "@/components/ui/reveal";
import Link from "@/components/localized-link";
import StaticSectionTheme from "../sections/static-section";
import BrandsSectionTheme3 from "../sections/brands-section";
import ProductSectionTheme3 from "../sections/product-section";
import NewsSectionTheme3 from "../sections/news-section";
import HomeHeroSection from "../hero-section";
interface PagePropsData extends HomePageData {
  faq: FAQ[];
}

export default function HomeStyle({ data }: { data: PagePropsData }) {
  return (
    <main className="pb-[195px]">
      <HomeHeroSection
        title={data.introduction_text.title || ""}
        description={data.introduction_text.content || ""}
        products={data.header_products}
      />
      {data.static_section?.cards?.length > 0 && (
        <StaticSectionTheme data={data.static_section} />
      )}

      <div className="overflow-hidden pt-[104px]">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-[70px] xl:flex-row-reverse">
            <Reveal direction="right" className="w-full max-w-[520px]">
              <div className="flex flex-col items-center gap-[28px] xl:items-start">
                <h2 className="text-center text-[20px] font-bold text-[#252525] xl:text-right">
                  {data.body_text?.title}
                </h2>

                <p className="text-center text-[14px] leading-[2] text-[#666666] xl:text-right">
                  {data.body_text?.content}
                </p>

                <Link
                  href="/about-us"
                  className="flex h-[38px] w-[136px] items-center justify-center rounded-[5px] border border-bastan1 text-[14px] text-bastan1 transition-all duration-300 hover:bg-bastan1 hover:text-white"
                >
                  بیشتر بدانید
                </Link>
              </div>
            </Reveal>

            <Reveal
              direction="left"
              className="w-full hidden xl:block max-w-[420px]"
            >
              <div className="relative h-[520px] w-full">
                <div className="absolute right-[-18px] top-[-14px] z-0 h-full w-full rounded-[4px] bg-[#F0DEC6]" />

                <div className="relative z-10 h-full w-full">
                  <Image
                    src="/images/hero/slide-1-mobile.jpg"
                    alt="Bastan"
                    fill
                    className="rounded-[4px] border border-bastan1 object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {data.logo_bands.length > 0 && (
        <Reveal direction="down">
          <BrandsSectionTheme3 data={data.logo_bands} />
        </Reveal>
      )}

      {/* {
        <section className="container flex flex-col items-center mt-[127px]">
          <h2 className="text-[#2A2A2A] font-bold text-[32px] text-center">
            {data.video?.title}
          </h2>
          <p className="text-sm mt-2 text-[#2A2A2A] text-center">
            {data.video?.description}
          </p>

          <div
            className="relative w-full max-w-[758px] h-[331px] bg-cover bg-center overflow-hidden mt-12"
            style={{ backgroundImage: `url(${data.video?.thumbnail})` || "" }}
          >
            <div className="absolute inset-0 flex flex-col justify-center items-center ">
              {data.video?.video_file && (
                <VideoPlayer videoHtml={data.video.video_file} />
              )}
            </div>
          </div>
        </section>
      } */}

      {data.product_section?.cards?.length > 0 && (
        <ProductSectionTheme3
          title={data.product_section.title}
          description={data.product_section.description}
          data={data.product_section.cards}
        />
      )}

      {/* Representatives Banner */}
      <Reveal>
        <section className="container mt-[110px]">
          <Link
            href="/representatives"
            className="block w-full overflow-hidden rounded-[10px]"
          >
            <div className="relative aspect-[3.7/1] w-full">
              <Image
                src="/images/representatives-banner.jpg"
                alt="نمایندگی‌های باستان"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </section>
      </Reveal>

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
            <h2 className="font-bold text-xl text-[#252525]">
              <Trans>با ما در ارتباط بمانید</Trans>
            </h2>
            <span className="text-sm text-[#626262] mt-2 text-center">
              <Trans>ارتباط با کارخانه...</Trans>
            </span>
            <HomeContactForm textColor="#000000" />
          </div>
        </section>
      )}

      {/* {data.show_terms_and_conditions && data.faq.length > 0 && (
        <section className="container flex flex-col items-center mt-[116px]">
          <h2 className="font-bold text-xl text-[#252525] text-center">
            <Trans>قوانین و مقررات | سوالات متداول</Trans>
          </h2>
          <span className="text-sm text-[#626262] mt-2 text-center mb-14">
            <Trans>با جدیدترین متد های طراحی کاشی</Trans>
          </span>
          <HomeFaqList data={data.faq} />
        </section>
      )} */}
    </main>
  );
}
