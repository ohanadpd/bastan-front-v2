import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import Image from 'next/image';
import { ArrowLeft2, Import } from 'iconsax-reactjs';
import { fetchCatalogsList, fetchCatalogsPageDetails } from '@/lib/services/catalogs.services';
import { notFound } from 'next/navigation';
import Link from '@/components/localized-link'
import { cn } from '@/lib/utils';
import Pagination from '@/components/ui/pagination';
import CatalogHero from '@/components/catalog/hero';

export async function generateMetadata() {
    const { data } = (await fetchCatalogsPageDetails())
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
        lang: string;
    }>;
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);

    // fetching data of page (banner, title and subtitle)
    const { data: pageDetails } = await fetchCatalogsPageDetails();

    const page = Number((await searchParams).page) || 1;
    const limit = 12;

    let data;
    try {
        const { data: catalogs } = await fetchCatalogsList(page, limit);
        data = catalogs
    } catch (error: any) {
        return notFound()
    }

    const totalPages = Math.ceil(data ? (data?.count / limit) : 0);

    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams();

        // Manually iterate over searchParams and only add valid string values
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                params.set(key, value);
            }
        });

        params.set('page', newPage.toString());
        return `/catalog?${params.toString()}`;
    };

    return (
        <main className='pb-[123px]'>
            <CatalogHero
                bannerImage={pageDetails.banner_image}
                mobileBannerImage={pageDetails.banner_image_mobile}
                />
            <div className='container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-24'>
                {data.results.map((item, index) => <div key={index} className='group relative rounded-[5px] overflow-hidden aspect-square'>
                    {item.image && <Image src={item.image} alt="slide" fill className="object-cover group-hover:scale-105 duration-300" />}
                    <div className='flex justify-between items-center absolute inset-x-0 bottom-0 bg-[#3A3A3A94]/60 h-[51px] px-3'>
                        <h3 className='text-white font-semibold truncate'>
                            {item.name}
                        </h3>
                        <a href={item.download_url} target="_blank">
                            <span className='flex items-center justify-center size-10 bg-primary rounded-[5px]'>
                                <Import size={24} color='white' />
                            </span>
                        </a>
                    </div>
                </div>)}
                <div className='flex justify-center mt-4 col-span-full w-full'>
                    <Pagination currentPage={page} totalPages={totalPages} />
                </div>
            </div>
        </main>
    );
}