import CartContent from '@/components/cart/cart-content';
import { fetchCartList } from '@/lib/services/products.services';
import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`سبد خرید`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function CartPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    const session = await auth();
    if (!session) {
        redirect(`/${lang}/auth/login`)
    }
    const { data: cartList } = await fetchCartList();
    return (
        <main className="container mt-[140px] mb-[172px] xl:mb-[102px]">
            <h1 className='text-primary font-bold text-lg xl:text-xl mb-9'>
                <Trans>سبد خرید</Trans> {cartList.items.length}
            </h1>
            <CartContent initialCart={cartList ?? null} />
        </main>
    );
}