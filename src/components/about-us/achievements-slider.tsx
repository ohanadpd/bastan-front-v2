"use client";
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import LocalizedLink from '@/components/localized-link';
import { Achivment } from '@/types/about-us.types';
import { toPersianDate } from '@/lib/utils';

export default function AchievementsSlider({ className, data }: { className?: string, data: Achivment[] }) {
    const [swiper, setSwiper] = useState<any>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <Swiper
                // install Swiper modules
                modules={[Pagination, Scrollbar]}
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
                        <div className='group flex flex-col gap-3 '>
                            <div className='flex flex-col gap-[14px]'>
                                <Image src={item.image} alt="slide" width={500} height={500} className="object-cover w-full h-auto rounded-[5px]" />
                            </div>
                            <div className='text-[#474747] group-hover:text-primary transition-all duration-300'>
                                <h3 className='font-semibold '>
                                    {item.title}
                                </h3>
                                {item.date && <span className='text-sm'>
                                    {toPersianDate(item.date)}
                                </span>}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div ref={paginationRef} className='!static flex justify-center items-center gap-[2.5px] w-fit mt-6 mx-auto'></div>
            </Swiper>
        </>
    );
}