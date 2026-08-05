'use client';

import CartItem from '@/components/cart/cart-item';
import { Button } from '@/components/ui/button';
import { useCartStore } from "@/store/cartStore";
import type { CartList } from '@/types/products.types';
import { useEffect, useRef } from 'react';
import Link from "@/components/localized-link";
import { Trans } from '@lingui/react/macro';

interface CartContentProps {
    initialCart: CartList | null;
}

export default function CartContent({ initialCart }: CartContentProps) {
    const cart = useCartStore((state) => state.cart);
    const removeItem = useCartStore((state) => state.removeItem);
    const setCart = useCartStore((state) => state.setCart);
    const hasSyncedRef = useRef(false);

    // Sync server data with client store only on initial mount
    useEffect(() => {
        if (initialCart && !hasSyncedRef.current) {
            setCart(initialCart);
            hasSyncedRef.current = true;
        }
    }, [initialCart, setCart, cart]);

    // Use store cart if available, otherwise fall back to initialCart
    const cartList = cart || initialCart;

    return (
        <>
            <div className="xl:hidden flex flex-col items-center justify-center fixed bottom-0 inset-x-0 h-[121px] bg-white z-30 px-5 border-t-[0.6px] border-border">
                <div className="flex items-center justify-between w-full text-sm">
                    <span className="font-semibold">
                        <Trans>
                            مبلغ قابل پرداخت
                        </Trans>:
                    </span>
                    <span>
                        {cartList?.total_price?.toLocaleString() ?? '0'} <Trans>ریال</Trans>
                    </span>
                </div>
                <Button className="w-full h-8 text-sm">
                    <Trans>
                        تایید و ادامه
                    </Trans>
                </Button>
            </div>
            <div className="flex flex-col xl:flex-row gap-6 xl:gap-10">
                <div className="w-full bg-white rounded-[10px] p-5">
                    <div className="flex items-center justify-between pb-4 border-b-[1px] border-border">
                        <h3 className="font-bold">
                            <Trans>پرداخت آنلاین</Trans>
                        </h3>
                        <span className="text-sm">
                            <Trans>
                                {cartList?.items?.length ?? 0} قلم کالا
                            </Trans>
                        </span>
                    </div>
                    <div className="flex flex-col mt-5 xl:mt-8 gap-8 xl:gap-10">
                        {cartList?.items?.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-5 xl:gap-10 w-full xl:max-w-[280px] shrink-0 rounded-[10px] bg-white p-5 h-fit">
                    <h3 className="font-semibold">
                        <Trans>
                            خلاصه سفارش
                        </Trans>
                    </h3>
                    <div className="flex flex-col text-gray2 text-[13px] w-full">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>
                                    تعداد کل اقلام
                                </Trans>
                            </span>
                            <span>
                                {cartList?.items?.length ?? 0}
                            </span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>قیمت کل</Trans> :
                            </span>
                            <span>
                                {cartList?.items?.reduce((total, item) => total + (item.variant.price * item.quantity), 0).toLocaleString() ?? '0'} <Trans>ریال</Trans>
                            </span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>مبلغ قابل پرداخت</Trans>:
                            </span>
                            <span>
                                {cartList?.total_price?.toLocaleString() ?? '0'} <Trans>ریال</Trans>
                            </span>
                        </div>
                    </div>
                    <Link href={cartList && cartList?.items.length > 0 ? "/cart/submit" : "#"} className='w-full'>
                        <Button disabled={!cartList || cartList?.items.length <= 0} className="hidden xl:block w-full h-10 text-sm ">
                            <Trans>تایید و ادامه</Trans>
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

