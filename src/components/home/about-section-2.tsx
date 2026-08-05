import * as React from 'react';
import Image from 'next/image';
import { cn, getMediaUrl } from '@/lib/utils';
import { ImageGallery } from '@/types/home.types';

export default function HomeAboutSection2({ className, title, content, gallery }: { className?: string, title: string, content: string, gallery: ImageGallery[] }) {
    return (
        <section className={cn("container", className)}>
            <div className="flex flex-col xl:flex-row justify-between items-center gap-[96px]">
                <div className="flex flex-col gap-[30px]">
                    <h1 className="font-bold text-[#252525] text-xl">
                        { title }
                    </h1>
                    <p className="max-w-[737px] text-[#383838]">
                        { content }
                    </p>
                </div>
                <div className='relative w-full max-w-[455px] h-[582px] shrink-0'>
                    <div className='absolute top-0 end-[230px] xl:end-[240px] size-[100px] bg-primary z-10'></div>
                    <div className='absolute bottom-0 start-[235px] size-[64px] bg-[#000000]'></div>
                    <div className='absolute top-8 end-0 w-[300px] h-[415px] bg-cover bg-center'>
                        {gallery[0]?.image && <Image src={getMediaUrl(gallery[0].image)} alt={gallery[0].alt || 'image'} fill className='object-cover' />}
                    </div>
                    <div className='absolute bottom-8 start-0 w-[272px] h-[287px] bg-cover bg-center'>
                        {gallery[1]?.image && <Image src={getMediaUrl(gallery[1].image)} alt={gallery[1].alt || 'image'} fill className='object-cover' />}
                    </div>
                </div>
            </div>
        </section>
    );
}