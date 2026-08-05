import { initLingui } from '@/initLingui';
import * as React from 'react';
import AuthWrapper from '@/components/auth/auth-wrapper';
import AuthForgotPasswordForm from '@/components/auth/forgot-password-form';

export const metadata = {
    title: 'Forgot Password',
};

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function ForgotPasswordPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    return (
        <AuthWrapper>
            <AuthForgotPasswordForm />
        </AuthWrapper>
    );
}