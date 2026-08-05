import * as React from 'react';
import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import { Crown, DollarCircle, Flag, Flag2 } from 'iconsax-reactjs';
import { fetchCartList, fetchProductDetails, fetchProductPageDetails } from '@/lib/services/products.services';
import ProductsAddToCard from '@/components/products/add-to-card';
import { auth } from "@/auth";
import ProductSlider from '@/components/products/ProductSlider';
import ProductContent from '@/components/products/product-content';
import Link from 'next/link';
import { fetchSettingsData } from '@/lib/services/settigns.services';
import { headers } from 'next/headers'
import { userAgent } from 'next/server'

const isShoppingMode = process.env.NEXT_PUBLIC_IS_SHOPPING_MODE === 'true';

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const { data } = (await fetchProductDetails(slug[0]))
    return {
        title: data.page_title,
        description: data.page_description,
        keywords: data.page_keywords,
        openGraph: {
            title: data.page_title,
            description: data.page_description,
        },
    }
}

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string[];
    }>;
    searchParams: Promise<{
        variant: string
    }>;
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
    const { lang, slug } = await params;
    const { variant } = await searchParams;
    const session = await auth();

    const i18n = initLingui(lang);

    const { data } = await (await fetchProductDetails(slug[0]))
    const { data: settingsData } = await fetchSettingsData();

    const selectedVariant = data.variants[0]

    let cart;
    if (session)
        cart = (await fetchCartList()).data
    const productInCart = cart?.items.find(p => p.variant.id.toString() === slug[0])

    const variantData = selectedVariant;

    // if (variant)
    //     variantData = data.variants.find(v => v.id == Number(variant))
    // else
    //     variantData = data?.variants.find(v => v.default === true)


    const headersList = await headers()
    const ua = userAgent({ headers: headersList })
    const isMobile = ua.device.type === 'mobile'

    return (
        <main className='mb-[62px] mt-32'>
            {/* <header className='h-[566px] bg-cover bg-center' style={{ backgroundImage: `url(${getMediaUrl(data.image)})` }}>
                <ProductsDetailHeader title={data.name} gallery={data.gallery} />
            </header> */}
            <div className='container'>
                <span className='text-[#605F5F] text-sm'>
                    <Link href='/'><Trans>خانه</Trans></Link> / <Link href='/products'><Trans>محصولات</Trans></Link> / {data.name}
                </span>
            </div>
            <div className='container flex flex-col gap-10 xl:flex-row xl:justify-between mt-5'>
                {/* <div className='w-full xl:max-w-[740px]'>
                    <OverviewSection overview={data.description} variants={data.variants} />
                </div> */}
                <div className='w-full xl:w-[294px]'>
                    <ProductSlider data={data.gallery} />
                </div>
                <div className='flex-1'>
                    <h2 className='font-lg font-bold'>
                        {data.name}
                    </h2>
                    <ul className='mt-5 space-y-5'>
                        {selectedVariant.attribute_values.filter((attr) => (attr.attribute_name !== "سایز" && attr.attribute_name !== "نوع")).map((attr, idx) => (
                            <li key={idx} className='flex items-center justify-between text-[#605F5F]'>
                                <span>
                                    {attr.attribute_name}
                                </span>

                                <span>
                                    {attr.value ?? '-'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id='information-card' className='sticky top-[100px] flex flex-col w-full h-fit xl:max-w-[265px] shrink-0 rounded-[5px] overflow-hidden p-4 bg-white text-[#424242]'>
                    {variantData?.price != 0 && isShoppingMode && <div className='flex justify-between mb-10'>
                        <span className='font-bold text-sm text-[#404040]'>
                            قیمت
                        </span>
                        <div className='flex flex-col'>
                            <><span className='text-[#202020] font-bold'>
                                {variantData?.price.toLocaleString()} <span className='text-[#828282] text-xs'><Trans>ریال</Trans></span>
                            </span>
                                {variantData?.dollar_price && <span className='text-[#202020] font-bold'>
                                    {variantData?.dollar_price?.toLocaleString() || "-"} <span className='text-[#828282] text-sm font-mono'>$</span>
                                </span>}
                            </>
                        </div>
                    </div>}
                    <div className='flex flex-col'>
                        <div className='flex gap-2 border-b-[0.6px] border-[#D2D2D2] pb-4'>
                            <Flag2 size={20} color='#656565' className='flex-shrink-0' />
                            <span className='text-sm'>
                                <Trans>
                                    برند
                                </Trans>:
                                <span className='font-semibold ms-1'>
                                    {data?.brand?.name || '-'}
                                </span>
                            </span>
                        </div>
                        <div className='flex gap-2 border-b-[0.6px] border-[#D2D2D2] py-4'>
                            <Crown size={20} color='#656565' className='flex-shrink-0' />
                            <span className='text-sm'>
                                <Trans>
                                    نوع محصول
                                </Trans>:
                                <span className='font-semibold ms-1'>
                                    {selectedVariant.attribute_values.find((item) => item.attribute_name === "نوع")?.value || "--"}
                                </span>
                            </span>
                        </div>
                        <div className='flex gap-2 pt-4'>
                            <Flag size={20} color='#656565' className='flex-shrink-0' />
                            <span className='text-sm'>
                                <Trans>
                                    سایز
                                </Trans>:
                                <span dir='ltr' className='font-semibold ms-1'>
                                    {selectedVariant.attribute_values.find((item) => item.attribute_name === "سایز")?.value || "--"}
                                </span>
                            </span>
                        </div>
                    </div>


                    {/* {variantData?.attribute_values.map((attr) => (
                        <React.Fragment key={attr.id}>
                            <hr className='my-4 border-[#D2D2D2]' />
                            <div className='flex gap-2'>
                                <Flag size={20} color='#656565' className='flex-shrink-0' />
                                <span className='text-sm'>
                                    {attr.attribute_name}:
                                    <span className='font-semibold ms-1'>
                                        {attr?.value || '-'}
                                    </span>
                                </span>
                            </div>
                        </React.Fragment>
                    ))} */}
                    {isShoppingMode && variantData?.id &&
                        <ProductsAddToCard variantId={variantData.id} initialAmount={productInCart?.quantity} stockQuantity={variantData.stock_quantity} phoneNumber={settingsData.phone || ''} isMobile={isMobile} />
                    }
                </div>
            </div>
            <ProductContent product={data} />
            {/* {data?.related_products.length > 0 && <div className='container flex flex-col gap-7 xl:gap-10 mt-[68px] xl:mt-[120px]'>
                <h2 className='text-xl font-bold text-[#252525]'>
                    <Trans>
                        محصولات مرتبط
                    </Trans>
                </h2>
                <RelatedProductsSlider data={data.related_products} />
            </div>} */}
        </main>
    );
}