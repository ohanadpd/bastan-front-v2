'use client';
import { cn, getMediaUrl } from '@/lib/utils';
import { useLingui } from '@lingui/react/macro';
import Image from 'next/image';
import { useState } from 'react';
import RelatedProductsSlider from './related-products-slider';
import { ProductDetail } from '@/types/products.types';
import { Trans } from '@lingui/react/macro';

export default function ProductContent({ product }: { product: ProductDetail }) {
    const [activeTab, setActiveTab] = useState('overview');
    const { t } = useLingui();
    const tabs = [
        { id: 'overview', label: t`بررسی اجمالی` },
        { id: 'other_faces', label: t`سایر فیس ها` },
        { id: 'related_products', label: t`محصولات مرتبط` },
    ];

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


    return (
        <div className="xl:container mt-10 rounded-[15px] py-10 px-7">
            <ul className='flex items-center gap-4 text-sm text-secondary bg-white h-14 px-2 rounded-[10px] [&>li]:px-3 [&>li]:h-9 [&>li]:rounded-[5px] text-nowrap overflow-auto cursor-pointer'>
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={cn('flex justify-center items-center', activeTab === tab.id ? 'bg-primary text-white' : '')}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>
            <div className='flex flex-col xl:flex-row justify-between gap-5 mt-10'>
                <div className='flex-1'>
                    <div id="overview" className='space-y-7'>
                        <h3 className='font-bold text-lg'>
                            <Trans>
                                بررسی اجمالی محصول
                            </Trans>
                        </h3>
                        <div className='text-sm text-[#605F5F] [&>img]:!w-full [&>img]:!h-auto [&>img]:!rounded-md' dangerouslySetInnerHTML={{ __html: product.content }} />
                    </div>

                    <hr className='my-10' />

                    <div id="other_faces" className='space-y-7'>
                        <h3 className='font-bold text-lg'>
                            <Trans>
                                سایر فیس ها
                            </Trans>
                        </h3>
                        <div className='max-w-[820px]'>
                            {product.related_faces?.length > 0 ? <RelatedProductsSlider data={product.related_faces} /> : <span className='text-sm text-[#605F5F]'>فیس دیگری برای این محصول ثبت نشده است</span>}
                        </div>
                    </div>

                    <hr className='my-10' />

                    <div id="related_products" className='space-y-7'>
                        <h3 className='font-bold text-lg'>
                            <Trans>
                                محصولات مرتبط
                            </Trans>
                        </h3>
                        <div className='overflow-hidden max-w-[820px]'>
                            {product.related_products.length > 0 ? <RelatedProductsSlider data={product.related_products} /> : <span className='text-sm text-[#605F5F]'>محصول مرتبطی برای این محصول ثبت نشده است</span>}
                        </div>
                    </div>
                </div>
                <div className='relative'>
                    <div className=' sticky top-28 shrink-0 w-full xl:w-[278px] xl:h-[278px] bg-white rounded-[15px] p-3'>
                        <div className='relative w-full h-[166px] rounded-[15px] overflow-hidden'>
                            <Image src={getMediaUrl(product.image) || "/images/default.png"} alt="test" fill />
                        </div>
                        <div className='flex flex-col gap-5 mt-4'>
                            <h2 className='text-sm font-semibold text-[#202020]'>
                                {product.name}
                            </h2>
                            {product.variants[0].price != 0 && <div className='flex justify-between items-center text-sm text-[#605F5F]'>
                                <span>
                                    <Trans>
                                        قیمت
                                    </Trans>
                                </span>
                                <span className='font-semibold'>
                                    {product.variants[0].price.toLocaleString()} <span className='text-xs'><Trans>ریال</Trans></span>
                                </span>
                            </div>}
                            {product.variants[0].price == 0 &&<div className='text-[#424242] text-sm'>
                                <span className='me-1'>
                                    <Trans>برند</Trans> :
                                </span>
                                <span className='font-semibold'>
                                    {product.brand?.name || '-'}
                                </span>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}