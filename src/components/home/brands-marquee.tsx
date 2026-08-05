'use client';
import Image from 'next/image';
import * as React from 'react';
import Marquee from "react-fast-marquee";
import { LogoBand } from '@/types/home.types';
import { getMediaUrl } from '@/lib/utils';

export default function HomeBrandsMarquee({ data }: { data: LogoBand[] }) {
    return (
        <div dir='ltr' className='h-full'>
            <Marquee autoFill={true}>
                {data.map(item => (
                    item.logo && <div key={item.id} className='w-auto h-20 mx-8'>
                        <Image src={getMediaUrl(item.logo)} alt={item.alt || `brand-${item.id}`} width={200} height={200} className='w-full h-full object-contain transition-all duration-300 grayscale hover:grayscale-0' />
                    </div>
                ))}
            </Marquee>
        </div>
    );
}