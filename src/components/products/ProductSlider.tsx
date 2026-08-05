'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { cn, getMediaUrl } from '@/lib/utils';
import { Gallery } from '@/types/products.types';
import ImageZoom from '../ui/image-zoom';

export default function ProductSlider({ data }: { data: Gallery[] }) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const handleSlideChange = (swiper: any) => {
        setSelectedImage(swiper.activeIndex);
    }
    return (
        <div className='flex flex-col gap-[14px] xl:gap-2 shrink-0'>
            <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                onSlideChange={handleSlideChange}
                className='w-full h-auto rounded-[8.45px] overflow-hidden'
                pagination={{
                    clickable: true,
                    el: '.pagination-container',
                }}
                slidesPerView={1}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index} className='xl:!size-[294px] !h-[336px]'>
                        {/* <img src={getMediaUrl(item.image)} alt={item.title} className='w-full h-full object-cover' /> */}
                        <ImageZoom src={getMediaUrl(item.image)} alt={item.title} fill className='w-full h-full object-cover' />
                    </SwiperSlide>
                ))}
                {
                    data.length === 0 && (
                        <SwiperSlide className='xl:!size-[294px] !h-[336px]'>
                            <img src="/images/default.png" alt="product" className='w-full h-full object-cover' />
                        </SwiperSlide>
                    )
                }
            </Swiper>
            {/* <div className='pagination-container flex gap-[2px] justify-center static [&_.swiper-pagination-bullet-active]:bg-[#007AFF] [&_.swiper-pagination-bullet-active]:!w-[26px] [&_.swiper-pagination-bullet-active]:rounded-[10px] child:!w-[5px] child:!h-[5px] child:!m-0'></div> */}

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={15}
                slidesPerView={'auto'}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className='w-full'
                slidesOffsetAfter={0}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index} className='!w-fit'>
                        <img src={getMediaUrl(item.image_thumbnail)} alt={item.title} className={cn(selectedImage === index ? 'border-2 border-primary' : '', 'w-full h-auto size-[80px] object-cover rounded-[8.45px] cursor-pointer')} />
                    </SwiperSlide>
                ))}
                {
                    data.length === 0 && (
                        <SwiperSlide className='!w-fit'>
                            <img src="/images/default.png" alt="product" className={cn('border-2 border-primary', 'w-full h-auto size-[80px] object-cover rounded-[8.45px] cursor-pointer')} />
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </div>
    );
}