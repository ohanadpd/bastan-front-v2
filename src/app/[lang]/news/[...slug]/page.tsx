import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import BlogsPostSlider from '@/components/news/post-slider';
import LocalizedLink from '@/components/localized-link';
import { ArrowSquareLeft } from 'iconsax-reactjs';
import Image from 'next/image';
import { fetchNewsDetails, fetchNewsList } from '@/lib/services/news.services';
import { fetchArticleList } from '@/lib/services/articles.services';
import Link from '@/components/localized-link';

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string[]
    }>;

}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const { data } = (await fetchNewsDetails(slug[0]))
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

export default async function NewsDetailPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const i18n = initLingui(lang);

    const { data } = await fetchNewsDetails(slug[0]);
    const { data: latestArticles } = await fetchArticleList(1, 4);
    const { data: latestNews } = await fetchNewsList(1, 4);

    return (
        <main className='pb-[155px]'>
            <header className='relative h-[464px] bg-cover bg-center' style={{ backgroundImage: data.banner ? `url(${data.banner})` : '' }}>
                <div className='absolute inset-0 bg-black/60'></div>
                <div className='w-full h-full flex flex-col justify-center items-center gap-2 container relative z-10'>
                    <h1 className='text-white text-2xl xl:text-[32px] font-extrabold'>
                        {data.name}
                    </h1>
                    <p className='text-white text-sm xl:text-lg max-w-[50%] text-center line-clamp-5' >{data.sub_title}</p>
                    <div className='absolute bottom-5 left-1/2 -translate-x-1/2 xl:left-auto xl:start-0 xl:translate-x-0'>
                        <span className='text-white text-sm'>
                            <Link href='/articles'><Trans>خانه</Trans></Link> /
                        </span>
                        <span className='text-white text-sm'>
                            <Link href='/articles'><Trans>اخبار</Trans></Link> /
                        </span>
                        <span className='text-white text-sm'>
                            {data.name}
                        </span>
                    </div>
                </div>
            </header>
            <div className='container flex flex-col xl:flex-row gap-5 mt-12'>
                <div className='w-full'>
                    <div className='flex flex-col xl:flex-row gap-2 xl:justify-between'>
                        <h2 className='text-xl font-bold text-[#010101]'>
                            {data.name}
                        </h2>
                        <span className='text-xs text-[#7D7D7D]'>
                            {data.jcreated}
                        </span>
                    </div>
                    <div className='mt-[30px]'>
                        <div className='text-sm text-[#383838] [&>p>img]:!w-full [&>p>img]:!h-auto [&>p>img]:object-cover' dangerouslySetInnerHTML={{ __html: data.content }} />
                    </div>
                    <hr className='mt-10 border-[#9C9C9C] border-[0.6px]' />
                </div>
                <div className='w-full xl:max-w-[266px] shrink-0'>
                    <div className='flex flex-col gap-2 sticky top-[100px]'>
                        <div className='bg-white p-5 rounded-[10px]'>
                            <h3 className='text-sm font-bold pb-2 border-b-[0.6px] border-[#9C9C9C]'>
                                <Trans>
                                    جدیدترین اخبار
                                </Trans>
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {latestNews.results.map((news, index) => (
                                    <li key={index}>
                                        <LocalizedLink href={`/news/${news.pk}/${news.slug}`} className='group flex gap-2 text-sm text-[#575757] hover:text-primary transition-all duration-300'>
                                            <span className='text-xs text-[#575757] group-hover:text-primary transition-all duration-300'>
                                                <ArrowSquareLeft size={24} color='currentColor' />
                                            </span>
                                            {news.name}
                                        </LocalizedLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='bg-white p-5 rounded-[10px]'>
                            <h3 className='text-sm font-bold pb-2 border-b-[0.6px] border-[#9C9C9C]'>
                                <Trans>
                                    جدیدترین مقالات
                                </Trans>
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {latestArticles.results.map((article, index) => (
                                    <li key={index}>
                                        <LocalizedLink href={`/articles/${article.pk}/${article.slug}`} className='group flex gap-2 text-sm text-[#575757] hover:text-primary transition-all duration-300'>
                                            <span className='text-xs text-[#575757] group-hover:text-primary transition-all duration-300'>
                                                <ArrowSquareLeft size={24} color='currentColor' />
                                            </span>
                                            {article.name}
                                        </LocalizedLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='bg-white p-5 rounded-[10px]'>
                            <h3 className='text-sm font-bold pb-2 border-b-[0.6px] border-[#9C9C9C]'>
                                <Trans>
                                    مطالب مرتبط
                                </Trans>
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {data.related_posts.map((related, index) => (
                                    <li key={index}>
                                        <LocalizedLink href={`/news/${related.pk}/${related.slug}`} className='group flex gap-2 text-sm text-[#575757] hover:text-primary transition-all duration-300'>
                                            <span className='text-xs text-[#575757] group-hover:text-primary transition-all duration-300'>
                                                <ArrowSquareLeft size={24} color='currentColor' />
                                            </span>
                                            {related.name}
                                        </LocalizedLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {data?.related_posts?.length > 0 && <div className='container mt-[50px]'>
                <h2 className='text-xl font-bold text-[#252525] mb-7'>
                    <Trans>
                        مطالب مرتبط
                    </Trans>
                </h2>
                <BlogsPostSlider data={data.related_posts} type='news' />
            </div>}
        </main>
    );
}