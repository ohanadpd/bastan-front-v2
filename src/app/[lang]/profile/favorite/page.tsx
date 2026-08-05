import { Trans } from '@lingui/react/macro';
import { initLingui } from '@/initLingui';
import * as React from 'react';
import ProductCard from '@/components/ui/product-card';
import Link from '@/components/localized-link';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Favorite',
};

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}


export default async function FavoritePage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    return (
        <main className='container mt-[188px] pb-[100px]'>
            <h1 className='text-2xl xl:text-[32px] font-bold text-primary text-center'>
                <Trans>
                    محصولات مورد علاقه
                </Trans>
            </h1>
            <div className='flex flex-col items-center mt-8 xl:mt-[52px]'>
                <p className='text-[#656565] xl:text-xl text-center'>
                متاسفانه هنوز هیچ محصولی وجود ندارد !
                </p>
                <Link href="/products">
                    <Button className='w-full max-w-[232px] xl:max-w-[285px] h-10 xl:h-12 mt-8'>
                        <Trans>
                            محصولات
                        </Trans>
                    </Button>
                </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5 mt-10 xl:mt-[59px]'>
                {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCard key={index} />
                ))}
            </div>
        </main>
    );
}