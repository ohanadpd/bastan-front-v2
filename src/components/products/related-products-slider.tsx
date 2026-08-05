"use client";
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import ProductCard from '../ui/product-card';
import Link from '@/components/localized-link';
import { RelatedProduct } from '@/types/products.types';

export default function RelatedProductsSlider({ className, data }: { className?: string, data: RelatedProduct[] }) {
    const [swiper, setSwiper] = useState<any>(null);
    return (
        <>
            <Swiper
                // install Swiper modules
                modules={[Pagination, Scrollbar]}
                spaceBetween={15}
                // slidesPerView={4}
                breakpoints={{
                    1024: {
                        slidesPerView: 3,
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
                pagination={{
                    clickable: true,
                    el: '#swiper-pagination',
                    type: 'bullets',
                    bulletClass: 'size-[5px] rounded-full',
                    bulletActiveClass: '!bg-primary w-10',
                    renderBullet: function (index: number, className: string) {
                        return `<span class="bg-[#D9D9D9] ${className}">sss</span>`;
                    }
                }}
                onSwiper={(swiper) => setSwiper(swiper)}
                onSlideChange={() => console.log('slide change')}
                className={cn('h-full', className)}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index} className='p-1'>
                        <Link href={`/products/${item.id}/${item.slug}`}>
                            <ProductCard title={item.name} description={item.description} image={item.image}/>
                        </Link>
                    </SwiperSlide>
                ))}
                <div id='swiper-pagination' className='!static flex justify-center items-center gap-[2.5px] w-fit mt-6 mx-auto'></div>
            </Swiper>

        </>
    );
}