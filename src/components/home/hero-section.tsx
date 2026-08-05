'use client';
import * as React from 'react';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Button } from '../ui/button';
// Import Swiper styles
import 'swiper/css';
import { useState } from 'react';
import { HeaderGallery } from '@/types/home.types';
import Link from '@/components/localized-link';
interface PageProps {
    gallery: HeaderGallery[];
}

export default function HomeHeroSection({ gallery }: PageProps) {
    const [swiper, setSwiper] = useState<any>(null);
    return (
        <div dir='ltr' className="h-[600px] xl:h-[749px]">
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{
                    clickable: true,
                    el: '#swiper-pagination',
                    type: 'bullets',
                    bulletClass: 'size-[5px] rounded-full',
                    bulletActiveClass: '!bg-primary w-10',
                    renderBullet: function (index: number, className: string) {
                        return `<span class="bg-[#D9D9D9] ${className}"></span>`;
                    }
                }}
                onSwiper={(swiper) => setSwiper(swiper)}
                onSlideChange={() => console.log('slide change')}
                className='h-full w-full'
            >
                {gallery.map((item) => (
                    <SwiperSlide key={item.id} className='relative h-full w-full'>
                        {item.image && <Image src={item.image} alt={item.alt || `slide-${item.id}`} fill className="object-cover" />}
                        <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-8'>
                            <h3 className='font-extrabold text-white text-center text-[28px] xl:text-[36.91px] max-w-[367px]'>
                                {item.title}
                            </h3>
                            {item.link && <Link href={item.link}><Button>
                                بیشتر بدانید
                            </Button></Link>}
                        </div>
                    </SwiperSlide>
                ))}
                {gallery.length > 1 && <div className='absolute top-[410px] xl:top-1/2 xl:-translate-y-1/2 left-0 right-0 mx-auto w-full max-w-[1120px] px-5 xl:px-0 z-10'>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='cursor-pointer size-6 xl:size-8 bg-white rounded-full flex items-center justify-center' onClick={() => swiper.slidePrev()}><ArrowLeftIcon /></div>
                        <div className='cursor-pointer size-6 xl:size-8 bg-white rounded-full flex items-center justify-center' onClick={() => swiper.slideNext()}><ArrowRightIcon /></div>
                    </div>
                </div>}
                {gallery.length > 1 && <div id='swiper-pagination' className='absolute flex justify-center items-center gap-[2.5px] bottom-[18px] left-1/2 -translate-x-1/2 z-10 w-fit'></div>}
            </Swiper>
        </div>
    );
}


const ArrowLeftIcon = () => {
    return (
        <svg className='size-3 xl:size-4' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.38004 3.95337L2.33337 8.00004L6.38004 12.0467" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.6667 8H2.44666" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const ArrowRightIcon = () => {
    return (
        <svg className='size-3 xl:size-4' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.61999 12.0466L13.6667 7.99996L9.61999 3.9533" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.33334 8L13.5533 8" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}