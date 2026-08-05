import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from '@/components/localized-link';
import { fetchCartList, fetchDeliveryMethods } from '@/lib/services/products.services';
import { Trans } from '@lingui/react/macro';
import { fetchAddresses } from '@/lib/services/account.services';
import { initLingui } from '@/initLingui';
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CartSubmitPage from '@/components/cart/cart-submit-page';

export const metadata = {
    title: 'ادامه خرید',
};

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}


export default async function SubmitPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    const session = await auth();
    if (!session) {
        redirect(`/${lang}/auth/login`)
    }
    const { data: cartList } = await fetchCartList();
    const { data: addressList } = await fetchAddresses();
    const { data: deliveryMethods } = await fetchDeliveryMethods({});
    const data = {
        cartList: cartList,
        addressList: addressList.results,
        deliveryMethods: deliveryMethods.results
    }
    if (!cartList?.items?.length)
        redirect(`/${lang}/cart`)
    return (
        <CartSubmitPage data={data} />
    );
}