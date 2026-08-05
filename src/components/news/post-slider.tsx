"use client";
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import { useState, useRef, useEffect } from 'react';
import { cn, getMediaUrl } from '@/lib/utils';
import Image from 'next/image';
import LocalizedLink from '@/components/localized-link';
import { ArticleList } from '@/types/articles.types';

export default function BlogsPostSlider({ className, data, type }: { className?: string, data: ArticleList[], type: "news" | "articles" }) {
    const [swiper, setSwiper] = useState<any>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const [showPagination, setShowPagination] = useState(true);

    useEffect(() => {
        // When swiper is ready and data is loaded, decide whether to show pagination
        if (swiper) {
          const totalSlides = swiper.slides.length;
          const visibleSlides = swiper.params.slidesPerView as number;
          setShowPagination(totalSlides > visibleSlides);
        }
      }, [swiper, data]);

    return (
        <>
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar]}
                spaceBetween={20}
                slidesPerView={4}
                breakpoints={{
                    1024: {
                        slidesPerView: 4,
                    },
                    768: {
                        slidesPerView: 3,
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
                    el: paginationRef.current,
                    type: 'bullets',
                    bulletClass: 'size-[5px] rounded-full',
                    bulletActiveClass: '!bg-primary w-10',
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
                        <LocalizedLink href={`/${type}/${item.pk}/${item.slug}`} title='خبر شماره یک' className='group flex flex-col gap-3 '>
                            <div className='relative rounded-[5px] overflow-hidden h-[325px]'>
                                {item.image && <Image src={getMediaUrl(item.image)} alt="slide" fill className="object-cover object-center group-hover:scale-105 transition-all duration-300" />}
                            </div>
                            <div>
                                <h3 className='font-bold text-[#383838] group-hover:text-primary transition-all duration-300'>
                                    {item.name}
                                </h3>
                                <div className='line-clamp-2 text-sm text-[#383838]' dangerouslySetInnerHTML={{ __html: item.description}} />
                                <span className='text-xs text-[#7D7D7D]'>
                                    {item.jcreated}
                                </span>
                            </div>
                        </LocalizedLink>
                    </SwiperSlide>
                ))}
                {showPagination && <div ref={paginationRef} className='!static flex justify-center items-center gap-[2.5px] w-fit mt-6 mx-auto'></div>}
            </Swiper>
        </>
    );
}