import * as React from 'react';
import { Trans } from '@lingui/react/macro';
import { initLingui } from '@/initLingui';
import AgenciesMapWrapper from '@/components/representatives/map-wrapper';
import { fetchRepresentationList, fetchRepresentationPageDetails } from '@/lib/services/representation.services';
import Link from '@/components/localized-link';

export async function generateMetadata() {
    const { data } = (await fetchRepresentationPageDetails())
    return {
        title: data.page_title || data.title,
        description: data.page_description,
        keywords: data.page_keywords,
        openGraph: {
            title: data.title,
            description: data.page_description,
        },
    }
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
    searchParams: Promise<{
        representative?: string;
        province?: string;
        city?: string;
    }>;
}

export default async function AgenciesPage({ params, searchParams }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    const { representative, province, city } = await searchParams;

    const { data } = await fetchRepresentationList(representative || undefined, Number(city) || undefined, Number(province) || undefined)

    const { data: pageDetails } = await fetchRepresentationPageDetails()

    return (
        <main className='pb-[118px]'>
            <header className='relative h-[464px] bg-cover bg-center' style={{ backgroundImage: pageDetails.banner_image ? `url(${pageDetails.banner_image})` : '' }}>
                <div className='absolute inset-0 bg-black/60'></div>
                <div className='w-full h-full flex flex-col justify-center items-center gap-2 container relative z-10'>
                    <h1 className='text-white text-2xl xl:text-[32px] font-extrabold'>
                        {pageDetails.title}
                    </h1>
                    <p className='text-white text-sm xl:text-lg'>
                        {pageDetails.sub_title}
                    </p>
                    <div className='absolute bottom-5 left-1/2 -translate-x-1/2 xl:left-auto xl:start-0 xl:translate-x-0'>
                        <span className='text-white text-sm'>
                            <Link href='/'><Trans>خانه</Trans></Link> /
                        </span>
                        <span className='text-white text-sm'>
                            {pageDetails.title || <Trans>نمایندگی ها</Trans>}
                        </span>
                    </div>
                </div>
            </header>

            <AgenciesMapWrapper className='mt-9' initialData={data.results} />
        </main>
    );
}