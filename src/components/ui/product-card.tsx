import * as React from 'react';
import Image from 'next/image';
import { cn, getMediaUrl } from '@/lib/utils';
import { ShoppingCart } from 'iconsax-reactjs';
import { Badge as IBadge } from '@/types/products.types';
import { Badge } from './badge';

const isShoppingMode = process.env.NEXT_PUBLIC_IS_SHOPPING_MODE === 'true';

export default function ProductCard({ className, 
    title, 
    description, 
    badges, 
    image 
}: { className?: string, title?: string, description?: string, badges?: IBadge[], image?: string }) {
    return (
        <div className={cn("group", className)}>
            <div className='w-full xl:w-auto h-[203px] relative rounded-t-[5px] overflow-hidden'>
                {image && <Image src={getMediaUrl(image)} alt="slide" fill className="object-cover group-hover:scale-105 transition-all duration-300" />}
            </div>
            <div className='flex flex-col gap-2 bg-white rounded-b-[5px] p-3 mt-2 group-hover:outline outline-primary outline-[0.6px]'>
                <h3 className='text-sm font-semibold text-[#252525] group-hover:text-primary transition-all duration-300'>
                    {title}
                </h3>
                <p className='line-clamp-2 text-sm text-[#5C5C5C]'>
                    {description}
                </p>
                <div className='flex justify-between gap-2'>
                    <div className='flex items-center flex-wrap gap-2'>
                        {badges?.map((item) => (
                            <Badge key={item.id}>
                                {item.name}
                            </Badge>
                        ))}
                    </div>
                    {isShoppingMode && <span className='self-end flex justify-center items-center bg-primary size-10 text-white rounded-[5px]'>
                        <ShoppingCart size={24} color='currentColor' />
                    </span>}
                </div>
            </div>
        </div>
    );
}