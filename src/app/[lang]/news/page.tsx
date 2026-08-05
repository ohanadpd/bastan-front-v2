import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'iconsax-reactjs';
import { NewCard } from '@/components/news/new-card';
import BlogsPostSlider from '../../../components/news/post-slider';
import LocalizedLink from '@/components/localized-link';
import { fetchNewsCategories, fetchNewsList, fetchNewsPageDetails } from '@/lib/services/news.services';
import { fetchSettingsData } from '@/lib/services/settigns.services';
import { ArticleCatergoriesList, ArticleList } from '@/types/articles.types';
import Link from '@/components/localized-link';

export async function generateMetadata() {
    const { data } = (await fetchNewsPageDetails())
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
}

export default async function BlogsPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);

    const { data: categories } = await fetchNewsCategories();
    const { data: latestArticles } = await fetchNewsList(1, 4)

    const { data: settings } = await fetchSettingsData()

    const { data: pageDetails } = await fetchNewsPageDetails()

    let groupedNews: {
        category: ArticleCatergoriesList;
        articles: ArticleList[]
    }[] = [];

    for (const ctg of categories.results) {
        const { data: latestCategoryNews } = await fetchNewsList(1, 12, String(ctg.pk))
        groupedNews = [...groupedNews,
        {
            "category": ctg,
            "articles": latestCategoryNews.results
        }
        ]
    }

    console.log(categories)

    return (
        <main className='pb-[155px]'>
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
                            {pageDetails.title}
                        </span>
                    </div>
                </div>
            </header>
            <section className='container mt-14'>
                <h2 className='text-xl font-bold text-[#252525]'>
                    <Trans>
                        جدید ترین اخبار {settings.name}
                    </Trans>
                </h2>
                <p className='text-sm text-[#626262] mt-2'>
                    <Trans>
                        در {settings.name} چه اتفاقی می افتد؟
                    </Trans>
                </p>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mt-12'>
                    {latestArticles.results[0] && <LocalizedLink href={`/news/${latestArticles.results[0].pk}/${latestArticles.results[0].slug}`} >
                        <NewCard title={latestArticles.results[0].name} description={latestArticles.results[0].description} image={latestArticles.results[0].image} className='w-full h-full' />
                    </LocalizedLink>}
                    <div className='h-full grid grid-rows-3 min-h-[623px] gap-[14px]'>
                        {latestArticles?.results?.slice(1, 4)?.map((item, index) => (
                            <LocalizedLink href={`/news/${item.pk}/${item.slug}`} key={index} title='خبر شماره یک'>
                                <NewCard title={item.name} description={item.description} image={item.image} className='w-full h-full' />
                            </LocalizedLink>
                        ))}
                    </div>
                </div>
            </section>
            {groupedNews.map((item) => (
                item.articles.length > 0 && <section key={item.category.pk} className='container mt-[88px]'>
                    <h2 className='text-xl font-bold text-[#252525]'>
                        {item.category.name}
                    </h2>
                    <div className='text-sm text-[#626262] mt-2' dangerouslySetInnerHTML={{ __html: item.category.description }} />
                    <div className='mt-12'>
                        <BlogsPostSlider data={item.articles} type='news' />
                    </div>
                </section>
            ))}
        </main>
    );
}