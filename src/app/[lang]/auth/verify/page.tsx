import * as React from 'react';
import { initLingui } from '@/initLingui';
import AuthWrapper from '@/components/auth/auth-wrapper';
import AuthVerifyForm from '@/components/auth/verify-form';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`تایید شماره موبایل`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function VerifyPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);

    return (
        <AuthWrapper>
            <AuthVerifyForm />
        </AuthWrapper>
    );
}