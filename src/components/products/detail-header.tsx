'use client';
import * as React from 'react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Trans, useLingui } from '@lingui/react/macro';
// Import Swiper styles
import 'swiper/css';
import Link from '@/components/localized-link';
import { Gallery } from '@/types/products.types';
import { getMediaUrl } from '@/lib/utils';

export default function ProductsDetailHeader({ title, gallery }: { title?: string, gallery?: Gallery[] }) {
    const [swiper, setSwiper] = React.useState<any>(null);
    const { i18n } = useLingui();
    const locale = i18n.locale;
    return (
        <div dir='ltr' className="w-full h-full">
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{
                    clickable: true,
                    el: '#product-header-swiper-pagination',
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
                {gallery && gallery?.length > 0 && gallery.map((item) => (
                    <SwiperSlide key={item.id} className='relative h-full w-full'>
                        <Image src={getMediaUrl(item.image)} alt={item.title} fill className="object-cover" />
                    </SwiperSlide>
                ))}


                <div className='flex flex-col items-center gap-3 absolute inset-x-0 bottom-0  z-10'>
                     {gallery && gallery?.length > 1 && <div id='product-header-swiper-pagination' className='static flex justify-center items-center gap-[2.5px] w-fit'></div>}
                    <div className='relative h-[83px] bg-black/60 w-full'>
                        <div className='hidden xl:block absolute xl:top-1/2 xl:-translate-y-1/2 left-0 right-0 mx-auto w-full max-w-[362px] z-10'>
                            {gallery && gallery?.length > 1 && <div className='flex items-center justify-between gap-4'>
                                <div className='cursor-pointer size-6 xl:size-8 bg-white rounded-full flex items-center justify-center' onClick={() => swiper.slidePrev()}><ArrowLeftIcon /></div>
                                <div className='cursor-pointer size-6 xl:size-8 bg-white rounded-full flex items-center justify-center' onClick={() => swiper.slideNext()}><ArrowRightIcon /></div>
                            </div>}
                        </div>
                        <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className='container h-full flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-2'>
                            <h1 className='text-white text-xl xl:text-[28px] font-extrabold max-w-[362px] truncate'>
                                {title}
                            </h1>
                            <span className='text-white text-sm xl:text-base'>
                                <Link href='/'><Trans>خانه</Trans></Link> / <Link href='/products'><Trans>محصولات</Trans></Link> / {title}
                            </span>
                        </div>

                    </div>
                </div>
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