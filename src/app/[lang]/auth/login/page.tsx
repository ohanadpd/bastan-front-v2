import { initLingui } from "@/initLingui";
import { msg } from "@lingui/core/macro";
import { getI18nInstance } from "@/appRouterI18n";

import AuthWrapper from "@/components/auth/auth-wrapper";
import AuthLoginForm from "@/components/auth/login-form";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const i18n = getI18nInstance(lang);

  return {
    title: i18n._(msg`ورود`),
  };
}

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;

  initLingui(lang);

  return (
    <AuthWrapper lang={lang}>
      <AuthLoginForm />
    </AuthWrapper>
  );
}