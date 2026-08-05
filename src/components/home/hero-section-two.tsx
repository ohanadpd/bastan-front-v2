'use client';
import * as React from 'react';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'iconsax-reactjs';
// Import Swiper styles
import 'swiper/css';
import { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { HeaderGallery } from '@/types/home.types';
import { getMediaUrl } from '@/lib/utils';
import Link from '@/components/localized-link';

interface PageProps {
    gallery: HeaderGallery[];
    title: string;
    description: string;
}

export default function HomeHeroSection2({ gallery, title, description }: PageProps) {
    const [swiper, setSwiper] = useState<any>(null);
    return (
        <div className='bg-[#252525]'>
            <div className='flex flex-col xl:flex-row'>
                <div className='flex flex-col justify-center gap-[30px] w-full xl:w-1/2 h-[600px] xl:h-[749px] max-w-[560px] mx-auto xl:mx-0 xl:ms-auto px-5 xl:px-0'>
                    <h1 className='text-white text-[36.91px] xl:max-w-[367px] text-start font-extrabold'>
                        {title}
                    </h1>
                    <p className='text-[#E3E3E3] text-start xl:max-w-[399px]'>
                        {description}
                    </p>
                    <Link href="/products">
                    <Button className='min-w-[180px] w-fit'>
                        <Trans>
                            دیدن محصولات
                        </Trans>
                    </Button>
                    </Link>
                </div>
                <div dir='ltr' className="h-[600px] xl:h-[749px] w-full xl:w-1/2">
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
                        {gallery.map(item => (
                            item.image && <SwiperSlide key={item.id} className='relative h-full w-full'>
                                <Image src={getMediaUrl(item.image)} alt={item.title || `slide-${item.id}`} fill className="object-cover" />
                                <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-8'>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className='absolute bottom-[15px] left-0 right-0 mx-auto w-full max-w-[340px] px-5 xl:px-0 z-10'>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='cursor-pointer size-6 bg-white rounded-full flex items-center justify-center' onClick={() => swiper.slidePrev()}><ArrowLeftIcon /></div>
                                <div id='swiper-pagination' className='flex justify-center items-center gap-[2.5px] w-fit'></div>
                                <div className='cursor-pointer size-6 bg-white rounded-full flex items-center justify-center' onClick={() => swiper.slideNext()}><ArrowRightIcon /></div>
                            </div>
                        </div>

                    </Swiper>
                </div>
            </div>
        </div>
    );
}


const ArrowLeftIcon = () => {
    return (
        <svg className='size-3' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.38004 3.95337L2.33337 8.00004L6.38004 12.0467" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.6667 8H2.44666" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const ArrowRightIcon = () => {
    return (
        <svg className='size-3' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.61999 12.0466L13.6667 7.99996L9.61999 3.9533" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.33334 8L13.5533 8" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}