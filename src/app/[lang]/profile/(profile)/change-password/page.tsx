import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import { initLingui } from '@/initLingui';
import ChangePasswordForm from '@/components/profile/change-password-form';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`تغییر رمزعبور`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    return (
        <main className="container mt-[140px] mb-[172px] xl:mb-[102px]">
            <h1 className="text-2xl xl:text-[32px] font-bold text-center text-primary">
                <Trans>تغییر رمز عبور</Trans>
            </h1>
            <ChangePasswordForm />
        </main>
    );
}