import * as React from 'react';
import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import { Button } from '@/components/ui/button';
import OrderCard from '@/components/profile/order-card';
import { fetchOrderList } from '@/lib/services/products.services';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`سفارشات`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function OrdersPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);

    const { data } = await fetchOrderList({})
    return (
        <main className="container max-w-[1280px] mx-auto mt-[140px] mb-[172px] xl:mb-[102px]">
            <h1 className="text-2xl xl:text-[32px] font-bold text-center text-primary">
                <Trans>سفارشات</Trans>
            </h1>

            {data.results.length > 0 && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-5 mt-8 xl:mt-14 mb-12 xl:mb-11">
                {data.results.map((item, index) => (
                    <OrderCard key={index} data={item} />
                ))}
            </div>}

            {data.results.length === 0 && <div className="mt-8 xl:mt-12 mb-11 xl:mb-6">
                <p className="text-center xl:text-xl text-gray3">
                    <Trans>متاسفانه هنوز هیچ سفارشی وجود ندارد !</Trans>
                </p>
            </div>}
        </main>
    );
}