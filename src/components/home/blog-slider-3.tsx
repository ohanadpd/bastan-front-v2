"use client";
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import UiBlogCard3 from '../ui/blog-card-3';
import { NewsCard } from '@/types/home.types';
import Link from '@/components/localized-link';

export default function HomeBlogSlider({ className, data }: { className?: string, data: NewsCard[] }) {
    const [swiper, setSwiper] = useState<any>(null);
    return (
        <>
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar]}
                spaceBetween={20}
                slidesPerView={4}
                breakpoints={{
                    1024: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    480: {
                        slidesPerView: 1,
                    },
                    320: {
                        slidesPerView: 1,
                    },
                }}
                navigation
                pagination={{
                    clickable: true,
                    el: '#swiper-pagination',
                    type: 'bullets',
                    bulletClass: 'size-[5px] rounded-full',
                    bulletActiveClass: '!bg-primary-dark w-10',
                    renderBullet: function (index: number, className: string) {
                        return `<span class="bg-[#D9D9D9] ${className}"></span>`;
                    }
                }}
                onSwiper={(swiper) => setSwiper(swiper)}
                onSlideChange={() => console.log('slide change')}
                className={cn('h-full w-full', className)}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Link href={`/news/${item.news.pk}/${item.news.slug}`}>
                            <UiBlogCard3 title={item.news.name} description={item.news.description} image={item.news.image} />
                        </Link>
                    </SwiperSlide>
                ))}
                <div id='swiper-pagination' className='!static flex justify-center items-center gap-[2.5px] w-fit mt-6 mx-auto'></div>
            </Swiper>
            
        </>
    );
}