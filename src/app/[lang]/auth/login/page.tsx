import { Trans } from '@lingui/react/macro';
import { initLingui } from '@/initLingui';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { default as Link } from '@/components/localized-link';
import AuthWrapper from '@/components/auth/auth-wrapper';
import AuthLoginForm from '@/components/auth/login-form';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`ورود`),
    };
}
interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function LoginPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    return (
        <AuthWrapper>
            <AuthLoginForm />
        </AuthWrapper>
    );
}