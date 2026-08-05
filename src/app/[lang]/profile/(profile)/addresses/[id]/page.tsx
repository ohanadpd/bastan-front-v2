import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import { initLingui } from '@/initLingui';
import AddressForm from '@/components/profile/address-form';
import { fetchAddress } from '@/lib/services/account.services';
import { notFound } from 'next/navigation';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`ویرایش آدرس`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string;
        id: number;
    }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { lang, id } = await params;
    const i18n = initLingui(lang);

    let initialData;
    try {
        const { data } = await fetchAddress(id);
        initialData = data;
    } catch {
        notFound()
    }

    return (
        <main className="container mt-[140px] mb-[172px] xl:mb-[102px]">
            <h1 className="text-2xl xl:text-[32px] font-bold text-center text-primary">
                <Trans>ویرایش آدرس</Trans>
            </h1>
            <AddressForm id={id} initial={initialData} />
        </main>
    );
}