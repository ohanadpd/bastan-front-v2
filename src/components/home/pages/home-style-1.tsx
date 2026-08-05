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
import Link from "@/components/localized-link";
interface PagePropsData extends HomePageData {
    faq: FAQ[];
}

export default function HomeStyle1({ data }: { data: PagePropsData }) {
    return (
        <main className="pb-[195px]">
            <HomeHeroSection gallery={data.header_galleries} />

            {data.body_text && <HomeAboutSection className="pt-[94px]" data={data.body_text} logo={data.logo.image} />}

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

            {data.video && <HomeVideoSection className="pt-[175px]" data={data.video} />}

            {data.product_section?.cards?.length > 0 && <section className="relative py-14 bg-[#282828] mt-[169px] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/logos/nikceram-pattern.png')] bg-repeat-space bg-[length:calc(36px+24px)_calc(36px+20px)] opacity-[0.03]"></div>
                <div className="container flex flex-col items-center relative z-10">
                    <h2 className="font-bold text-xl text-white">
                        {data.product_section?.title}
                    </h2>
                    <span className="text-sm text-white mt-2">
                        {data.product_section?.description}
                    </span>
                    <HomeProductSection data={data.product_section?.cards} />
                </div>
            </section>}

            {data.news_section?.cards.length > 0 && <section className="container pt-[132px]">
                <h2 className="font-bold text-xl text-[#252525]">
                    {data.news_section?.title}
                </h2>
                <span className="text-sm text-[#626262] mt-2">
                    {data.news_section?.description}
                </span>
                <div className="flex flex-wrap gap-5 mt-14">
                    {data.news_section.cards[0] && <Link href={`/news/${data.news_section.cards[0].news.pk}/${data.news_section.cards[0].news.slug}`} className="lg:w-[57%]"><BlogCard className="" title={data.news_section.cards[0].news.name} description={data.news_section.cards[0].news.description} image={data.news_section.cards[0].news.image} /></Link>}
                    {data.news_section.cards[1] && <Link href={`/news/${data.news_section.cards[1].news.pk}/${data.news_section.cards[1].news.slug}`} className="lg:w-[41%]"><BlogCard className="" title={data.news_section.cards[1].news.name} description={data.news_section.cards[1].news.description} image={data.news_section.cards[1].news.image} /></Link>}
                    {data.news_section.cards[2] && <Link href={`/news/${data.news_section.cards[2].news.pk}/${data.news_section.cards[2].news.slug}`} className="lg:w-[41%]"><BlogCard className="" title={data.news_section.cards[2].news.name} description={data.news_section.cards[2].news.description} image={data.news_section.cards[2].news.image} /></Link>}
                    {data.news_section.cards[3] && <Link href={`/news/${data.news_section.cards[3].news.pk}/${data.news_section.cards[3].news.slug}`} className="lg:w-[57%]"><BlogCard className="" title={data.news_section.cards[3].news.name} description={data.news_section.cards[3].news.description} image={data.news_section.cards[3].news.image} /></Link>}
                </div>
            </section>}

            {data.static_section?.cards?.length > 0 && <section className="container flex flex-col items-center mt-[132px]">
                <h2 className="font-bold text-xl text-[#252525] text-center">
                    {data.static_section?.title}
                </h2>
                <span className="text-sm text-[#626262] mt-2 text-center">
                    {data.static_section?.description}
                </span>
                <div className="flex justify-center items-center gap-5 flex-wrap mt-[66px]">
                    {data.static_section.cards.map((card) => (
                        <StatCard key={card.id} title={card.title} value={card.number.toString()} />
                    ))}
                </div>
            </section>}
            {data.show_contact_us && <section className="mt-20 py-14 bg-[#4C4C4C]">
                <div className="container">
                    <h2 className="font-bold text-xl text-white">
                        <Trans>
                            با ما در ارتباط بمانید
                        </Trans>
                    </h2>
                    <span className="text-sm text-white mt-2 text-center">
                        <Trans>
                            ارتباط با کارخانه...
                        </Trans>
                    </span>
                    <HomeContactForm />
                </div>
            </section>}

            {data.show_terms_and_conditions && <section className="container flex flex-col items-center mt-[116px]">
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