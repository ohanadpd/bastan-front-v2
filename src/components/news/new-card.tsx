
import { cn, getMediaUrl } from '@/lib/utils';
import { ArrowRight } from 'iconsax-reactjs';
import * as React from 'react';
import Image from 'next/image';


type NewCardProps = React.ComponentPropsWithRef<'div'> & {
    image: string;
    title: string;
    description: string;
};

const NewCard = React.forwardRef<HTMLDivElement, NewCardProps>(
    ({ image, title, description, className, ...props }, ref) => {
        return <div ref={ref} {...props} className={cn('group relative rounded-[5px] overflow-hidden', className)}>
            {image && <Image src={getMediaUrl(image)} alt="slide" fill className="object-cover group-hover:scale-105 transition-all duration-300" />}
            <div className='absolute inset-x-0 p-3 bg-[#252525]/15 backdrop-blur-[32.3px] min-h-[77px] bottom-0'>
                <h3 className='text-white font-semibold line-clamp-1'>
                    {title}
                </h3>
                <div className='text-sm text-white mt-2 line-clamp-1 pe-10' dangerouslySetInnerHTML={{ __html: description}} />
                <span className='absolute flex items-center justify-center size-6 text-[#292D32] group-hover:text-white bg-white group-hover:bg-primary transition-all duration-300 rounded-full end-3 bottom-3 z-10'>
                    <ArrowRight size={16} color='currentColor' className='-rotate-45' />
                </span>
            </div>
        </div>;
    }
);

NewCard.displayName = 'NewCard';
export { NewCard };
