import * as React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'iconsax-reactjs';
import { getMediaUrl } from '@/lib/utils';

interface BlogCardProps {
    title: string;
    description: string;
    image?: string;
}

export default function UiBlogCard2({ title, description, image }: BlogCardProps) {
    return (
        <div className="relative h-[322px] rounded-[5px] overflow-hidden">
            {image && <Image src={getMediaUrl(image)} alt={title} fill className="object-cover object-center" />}
            <div className="flex flex-col justify-center px-2 text-white gap-2 absolute inset-x-0 h-20 bg-gradient-to-b from-[#56565663] to-[#060606] bottom-0">
                <h3 className="font-semibold line-clamp-1">
                    {title}
                </h3>
                <div className="flex items-center justify-between gap-4">
                    <div className="text-sm line-clamp-1 truncate" dangerouslySetInnerHTML={{ __html: description}} />
                    <span className="flex justify-center items-center rounded-full bg-white text-[#292D32] size-6 shrink-0">
                        <ArrowRight size={16} color="currentColor" className="-rotate-45" />
                    </span>
                </div>
            </div>
        </div>
    );
}