import * as React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'iconsax-reactjs';

interface BlogCardProps {
    title: string;
    description: string;
    image?: string;
}

export default function UiBlogCard3({ title, description, image }: BlogCardProps) {
    return (
        <div className='flex flex-col gap-[14px]'>
            <div className="relative h-[322px] rounded-[5px] overflow-hidden">
                {image && <Image src="/images/slides/01.png" alt="news" fill className="object-cover object-center" />}
            </div>
            <div className="flex flex-col justify-center px-2 gap-2">
                <h3 className="font-semibold text-[#313131] line-clamp-1">
                    {title}
                </h3>
                <div className="flex items-center justify-between gap-4">
                    <div className="text-sm line-clamp-1 truncate text-[#747474]" dangerouslySetInnerHTML={{ __html: description}}/>
                    <span className="flex justify-center items-center rounded-full bg-primary text-white size-6 shrink-0">
                        <ArrowRight size={16} color="currentColor" className="-rotate-45" />
                    </span>
                </div>
            </div>
        </div>
    );
}