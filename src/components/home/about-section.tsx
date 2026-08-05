import * as React from 'react';
import Image from 'next/image';
import { cn, getMediaUrl } from '@/lib/utils';
import { HomeBodyText } from '@/types/home.types';

export default function HomeAboutSection({ className, data, logo }: { className?: string, data: HomeBodyText, logo?: string; }) {
    return (
        <section className={cn("container", className)}>
            <div className="flex flex-col xl:flex-row justify-between items-center gap-[75px]">
                <div className="flex flex-col gap-[30px]">
                    <h1 className="font-bold text-[#252525] text-xl">
                        {data.title}
                    </h1>
                    <p className="max-w-[737px] text-[#383838]">
                        {data.content}
                    </p>
                </div>
                {logo && <Image src={getMediaUrl(logo)} alt={data.title} width={550} height={550} className="w-auto h-[91px] object-contain" />}
            </div>
        </section>
    );
}