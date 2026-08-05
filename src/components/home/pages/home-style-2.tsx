import Image from "next/image";
import { getI18nInstance } from "@/appRouterI18n";
import HomeHeroSection from "@/components/home/hero-section";
import { Trans } from "@lingui/react/macro";
import HomeProductSection from "@/components/home/product-section";
import { BlogCard } from "@/components/ui/blog-card";
import StatCard from "@/components/home/stat-card";
import HomeContactForm from "@/components/home/contact-from";
import { initLingui } from "@/initLingui";
import HomeBrandsMarquee from "@/components/home/brands-marquee";
import HomeFaqList from "@/components/home/faq-list";
import HomeHeroSection2 from "@/components/home/hero-section-two";
import HomeVideoSection from "@/components/home/video-section";
import HomeVideoSection2 from "@/components/home/video-section-2";
import HomeAboutSection from "@/components/home/about-section";
import HomeAboutSection2 from "@/components/home/about-section-2";
import HomeHeroSection3 from "@/components/home/hero-section-3";
import { fetchHomePage } from "@/lib/services/home.services";
import { fetchTermsPage } from "@/lib/services/terms.services";
import { HomePageData } from "@/types/home.types";
import { FAQ, TermsPageData } from "@/types/terms.types";
import HomeBlogSlider from "../blog-slider";

interface PagePropsData extends HomePageData {
    faq: FAQ[];
}

export default function HomeStyle2({ data }: { data: PagePropsData }) {
    return (
        <main className="pb-[195px]">
            <HomeHeroSection2 gallery={data.header_galleries} title={data.introduction_text?.title || ""} description={data.introduction_text?.content || ""} />

            <HomeAboutSection2 className="pt-[94px]" title={data.body_text.title || ""} content={data.body_text.content || ""} gallery={data.image_galleries.filter(image => image.publish)} />

            {data.logo_bands.length > 0 && <section className="container pt-[94px]">
                <h2 className="font-bold text-xl text-center">
                    <Trans>
                        برند های ما
                    </Trans>
                </h2>
                <div className="mt-16">
                    <HomeBrandsMarquee data={data.logo_bands} />
                </div>
            </section>}

            {data.video && <HomeVideoSection2 className="pt-[175px]" title={data.video.title} thumbnail={data.video.thumbnail} video={data.video.video_file} />}

            {data.static_section?.cards?.length > 0 && <section className="mt-[132px] py-[100px]">
                <div className="container flex flex-col items-center">
                    <h2 className="font-bold text-xl text-[#252525] text-center">
                        {data.static_section?.title}
                    </h2>
                    <span className="text-sm text-[#626262] mt-2 text-center">
                        {data.static_section?.description}
                    </span>
                    {/* <div className="flex justify-center items-center gap-5 flex-wrap mt-[66px]">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <StatCard key={index} title="کاشی تولید شده تا کنون" value="+1.250.000" />
                        ))}
                    </div> */}
                </div>
                <div className="flex flex-col xl:flex-row xl:justify-center w-full xl:h-[167px] border-t-[0.6px] border-b-[0.6px] border-[#979696] mt-[69px]">
                    {data.static_section.cards.map(item => (
                        <div key={item.id} className="flex flex-col justify-center items-center text-[#3D3D3D] w-full h-full xl:max-w-[285px] border-r-[0.6px] border-l-[0.6px] border-[#979696] border-y-[0.6px] xl:border-y-0 py-2">
                            <span dir='ltr' className="font-bold text-[34px] ">
                                {item.number}
                            </span>
                            <span className="text-lg text-center">
                                {item.title}
                            </span>
                        </div>
                    ))}
                </div>
            </section>}

            {data.product_section?.cards?.length > 0 && <section className="relative py-14 mt-[169px] overflow-hidden" style={{ backgroundColor: data.product_section.background_color }}>
                {/* <div className="absolute inset-0 bg-[url('/images/logos/nikceram-pattern.png')] bg-repeat-space bg-[length:calc(36px+24px)_calc(36px+20px)] opacity-[0.03]"></div> */}
                <div className="container flex flex-col items-start relative z-10">
                    <h2 className="font-bold text-xl text-white">
                        {data.product_section.title}
                    </h2>
                    <span className="text-sm text-white mt-2">
                        {data.product_section.description}
                    </span>
                    <HomeProductSection data={data.product_section.cards} />
                </div>
            </section>}

            {data.news_section?.cards && <section className="container pt-[132px]">
                <h2 className="font-bold text-xl text-[#252525]">
                    {data.news_section?.title}
                </h2>
                <span className="text-sm text-[#626262] mt-2">
                    {data.news_section?.description}
                </span>
                <div className="mt-14">
                    <HomeBlogSlider data={data.news_section.cards} />
                </div>
            </section>}


            {data.show_contact_us && <section className="mt-20 py-14">
                <div className="container">
                    <h2 className="font-bold text-xl text-[#252525]">
                        <Trans>
                            با ما در ارتباط بمانید
                        </Trans>
                    </h2>
                    <span className="text-sm text-[#626262] mt-2 text-center">
                        <Trans>
                            ارتباط با کارخانه...
                        </Trans>
                    </span>
                    <HomeContactForm textColor="#000000" />
                </div>
            </section>}

            {data.show_terms_and_conditions && data.faq.length > 0 && <section className="container flex flex-col items-center mt-[116px]">
                <h2 className="font-bold text-xl text-[#252525] text-center">
                    <Trans>
                        قوانین و مقررات | سوالات متداول
                    </Trans>
                </h2>
                <span className="text-sm text-[#626262] mt-2 text-center mb-14">
                    <Trans>
                        با جدیدترین متد های طراحی کاشی
                    </Trans>
                </span>
                <HomeFaqList data={data.faq} />
            </section>}
        </main>
    );
}