import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import Image from 'next/image';
import AchievementsSlider from '@/components/about-us/achievements-slider';
import { fetchAboutUsPage } from '@/lib/services/about-us.services';
import Link from '@/components/localized-link';
import AboutUsHero from "@/components/about-us/hero";

export async function generateMetadata() {
    const { data } = await fetchAboutUsPage();

    return {
        title: data.page_title,
        description: data.page_description,
        keywords: data.page_keywords,
        openGraph: {
            title: data.page_title,
            description: data.page_description,
        },
    };
}

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default async function AboutUsPage({ params }: PageProps) {
    const { data } = await fetchAboutUsPage();
    const { lang } = await params;

    initLingui(lang);

    return (
        <main className='pb-[155px]'>

            <AboutUsHero />

            <section className='container flex flex-col-reverse xl:flex-row gap-12 mt-[70px]'>
                <div className='flex flex-col gap-4 w-full'>
                    <h2 className='text-xl font-bold text-[#010101]'>
                        {data.about_text_title}
                    </h2>

                    <div
                        className='text-sm text-[#383838]'
                        dangerouslySetInnerHTML={{
                            __html: data.about_text
                        }}
                    />
                </div>

                {data.image && (
                    <Image
                        src={data.image}
                        alt="about"
                        width={500}
                        height={500}
                        className="object-contain h-[236px] w-full xl:w-auto xl:max-w-[50%]"
                    />
                )}
            </section>


            {data.achievements.length > 0 && (
                <section className='container mt-[122px]'>

                    <h3 className='text-center text-xl font-bold text-[#010101]'>
                        <Trans>
                            افتخارات و دستاورد های کارخانه
                        </Trans>
                    </h3>

                    <div className='mt-12'>
                        <AchievementsSlider data={data.achievements} />
                    </div>

                </section>
            )}


            <section className='container flex flex-col xl:flex-row items-center gap-5 mt-[114px]'>

                {data.manager_image && (
                    <Image
                        src={data.manager_image}
                        alt={data.manager_text_title}
                        width={500}
                        height={500}
                        className="object-contain w-full xl:max-w-[355px] h-[284px] rounded-[5px] shrink-0"
                    />
                )}

                <div className='flex flex-col gap-4'>

                    <h2 className='text-xl font-bold text-[#010101]'>
                        {data.manager_text_title}
                    </h2>

                    <div
                        className='text-sm text-[#383838]'
                        dangerouslySetInnerHTML={{
                            __html: data.manager_text
                        }}
                    />

                </div>

            </section>

        </main>
    );
}