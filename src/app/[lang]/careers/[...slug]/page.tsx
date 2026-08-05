import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import { initLingui } from '@/initLingui';
import CareersResumeForm from '@/components/careers/resume-form';
import ScrollToFormButton from '@/components/careers/scroll-to-form-button';
import { fetchEmploymentDetails, fetchEmploymentPageDetails, fetchPositions } from '@/lib/services/employment.services';
import { getMediaUrl } from '@/lib/utils';
import Link from '@/components/localized-link';

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const { data } = (await fetchEmploymentDetails(slug[0]))
    return {
        title: data.page_title,
        description: data.page_description,
        keywords: data.page_keywords,
        openGraph: {
            title: data.page_title,
            description: data.page_description,
        },
    }
}

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string[];
    }>;
}

export default async function CareerDetailPage({ params }: PageProps) {
    const { lang, slug } = await params;

    const { data } = await fetchEmploymentDetails(slug[0])
    const { data: pageDetails } = await fetchEmploymentPageDetails()
    const { data: positions } = await fetchPositions()
    const i18n = initLingui(lang);
    return (
        <main className='pb-[123px]'>
            <header className='relative h-[464px] bg-cover bg-center' style={{ backgroundImage: `url(${getMediaUrl((data.image || pageDetails.banner_image))})` }}>
                <div className='absolute inset-0 bg-black/60'></div>
                <div className='w-full h-full flex flex-col justify-center items-center gap-2 container relative z-10'>
                    <h1 className='text-white text-2xl xl:text-[32px] font-extrabold'>
                        <Trans>
                            فرصت های شغلی
                        </Trans>
                    </h1>
                    <p className='text-white text-sm xl:text-lg'>
                        {pageDetails.sub_title}
                    </p>
                    <div className='absolute bottom-5 left-1/2 -translate-x-1/2 xl:left-auto xl:start-0 xl:translate-x-0'>
                        <span className='text-white text-sm'>
                            <Link href='/'><Trans>خانه</Trans></Link> /
                        </span>
                        <span className='text-white text-sm'>
                            <Link href='/careers'><Trans>فرصت های شغلی</Trans></Link> /

                        </span>
                        <span className='text-white text-sm'>
                            {data.job_title}
                        </span>
                    </div>
                </div>
            </header>
            <section className='container mt-[60px]'>
                <h2 className='text-2xl font-extrabold '>
                    {data.job_title}
                </h2>
                <div className='mt-[58px] rounded-[5px] border-[0.6px] border-[#A6A6A6] px-5 py-7'>
                    <h3 className='text-lg font-bold text-[#3B3B3B]'>
                        <Trans>درباره این موقعیت شغلی</Trans>
                    </h3>
                    <div className='flex flex-col gap-2 mt-[26px] text-[#424141]'>
                        <div dangerouslySetInnerHTML={{ __html: data.description }} />
                        <div dangerouslySetInnerHTML={{ __html: data.content }} />
                    </div>
                    <ScrollToFormButton className='bg-primary font-semibold min-w-fit px-2 h-10 mt-1'>
                        <Trans>ارسال رزومه</Trans>
                    </ScrollToFormButton>
                </div>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6'>
                    <div className='rounded-[5px] border-[0.6px] border-[#A6A6A6] px-5 py-7'>
                        <h3 className='text-lg font-bold text-[#3B3B3B]'>
                            <Trans>مهارت های مورد نیاز و مسیولیتها</Trans>
                        </h3>
                        <div className='mt-[26px] text-[#424141]' dangerouslySetInnerHTML={{ __html: data.required_skills }} />
                    </div>
                    <div className='rounded-[5px] border-[0.6px] border-[#A6A6A6] px-5 py-7'>
                        <h3 className='text-lg font-bold text-[#3B3B3B]'>
                            <Trans>مزایای کار در این شرکت</Trans>
                        </h3>
                        <div className='mt-[26px] text-[#424141]' dangerouslySetInnerHTML={{ __html: data.required_skills }} />

                    </div>
                </div>
            </section>
            <section id='resume-form' className='mt-[98px]'>
                <h3 className='text-center font-bold text-xl'>
                    <Trans>
                        ارسال رزومه
                    </Trans>
                </h3>
                <div className='mt-10'>
                    <CareersResumeForm positions={positions.results} />
                </div>
            </section>
        </main>
    );
}