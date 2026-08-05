
import * as React from 'react';
import Image from 'next/image';
import { cn, getMediaUrl } from '@/lib/utils';

type BlogCardProps = React.ComponentPropsWithRef<'div'> & {
    title: string;
    description: string;
    image: string;
};

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
    ({ className, title, description, image, ...props }, ref) => {
        return (
            <div ref={ref} {...props} className={cn("group relative w-full h-[279px] overflow-hidden cursor-pointer rounded-[5px]", className)}>
                {image && <Image src={getMediaUrl(image)} alt="news" fill className="object-cover group-hover:scale-105 transition-all duration-300" />}
                <div className="absolute inset-x-0 px-4 py-3 bg-[#252525]/25 min-h-[77px] bottom-0 backdrop-blur-[32.3px]">
                    <h3 className="font-semibold text-white line-clamp-1">
                        {title}
                    </h3>
                    <div className="text-sm text-white mt-2 line-clamp-1 pe-10"  dangerouslySetInnerHTML={{__html: description}}/>
                    <span className="absolute bottom-3 end-[10px]">
                        <LinkIcon className='group-hover:[&>circle]:fill-primary group-hover:[&>path]:stroke-white' />
                    </span>
                </div>
            </div>
        );
    }
);

BlogCard.displayName = 'BlogCard';
export { BlogCard };


const LinkIcon = ({ className }: { className?: string }) => {
    return (
        <svg className={className}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" className='fill-white transition-all duration-300' />
            <path className='stroke-[#292D32] transition-all duration-300' d="M10.3978 7.99316L16.1206 7.99316L16.1206 13.716" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path className='stroke-[#292D32] transition-all duration-300' d="M8.10675 16.0068L16.0405 8.0731"  strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}