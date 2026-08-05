import { initLingui } from '@/initLingui';
import * as React from 'react';
import AuthWrapper from '@/components/auth/auth-wrapper';
import AuthCompleteRegisterForm from '@/components/auth/complete-register';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`ثبت نام`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function RegisterPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    return (
        <AuthWrapper>
            <AuthCompleteRegisterForm />
        </AuthWrapper>
    );
}