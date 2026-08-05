import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from '@/components/localized-link';
import { fetchAddresses } from '@/lib/services/account.services';
import { initLingui } from '@/initLingui';
import AddressList from '@/components/profile/address-list';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`آدرس`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function AddressesPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    const { data } = await fetchAddresses();
    
    return (
        <main className="container mt-[140px] mb-[172px] xl:mb-[102px]">
            <h1 className="text-2xl xl:text-[32px] font-bold text-center text-primary">
                آدرس ها
            </h1>

            <AddressList addresses={data.results} />

            

            <div className="flex justify-center">
                <Link href="/profile/addresses/new" className='w-full max-w-[232px] xl:max-w-[285px] mx-auto'>
                    <Button className="w-full h-10 xl:h-12">
                        افزودن آدرس جدید
                    </Button>
                </Link>
            </div>
        </main>
    );
}