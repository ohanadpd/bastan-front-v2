'use client';
import * as React from 'react';
import HomeProductSlider from './product-slider';
import { Trans } from '@lingui/react/macro';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/types/home.types';
import { Product } from '@/types/products.types';

export default function HomeProductSection({ textColor = "#FFFFFF", data }: { textColor?: string, data: ProductCard[] }) {
    const [active, setActive] = useState<string>();
    const [years, setYears] = useState<string[]>();
    const [products, setProducts] = useState<Product[]>()
    useEffect(()=>{
        const uniqueYears = Array.from(new Set(data.map(card => card.year)));
        setYears(uniqueYears);
        setActive(uniqueYears[0]);
    },[data])

    useEffect(() => {
        const products = data.filter(card => card.year === active).map(card => card.product);
        setProducts(products);
    },[active, data])
    return (
        <>
            <div className="mt-4 flex gap-6 items-center justify-center text-sm" style={{ color : textColor }}>
                {years?.map((item, index) => (
                    <button key={index} className={cn("px-2 py-[6px] rounded-[5px]", active === item && "outline outline-[0.6px]")} onClick={() => setActive(item)} style={{ outlineColor : textColor }}>
                        <Trans>سال</Trans> {item}
                    </button>
                ))}
            </div>
            {products && <HomeProductSlider className="mt-[55px]" data={products} />}
        </>
    );
}