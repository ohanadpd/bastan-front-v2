export const dynamic = 'force-dynamic'
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import "../globals.css";
import { initLingui } from "@/initLingui";
import { LinguiClientProvider } from "@/components/LinguiClientProvider";
import { allMessages } from '../../appRouterI18n'
import { getI18nInstance } from "@/appRouterI18n";
import { t } from '@lingui/core/macro'
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";
import { fetchSettingsData } from "@/lib/services/settigns.services";
import { hasCatalogs } from "@/lib/services/catalogs.services";
import ProgressBar from "@/components/ui/progress-bar";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import SetSettings from "@/components/setSettings";

const yekanBakh = localFont({
  src: [
    {
      path: '../../fonts/yekan/YekanBakhFaNum-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../fonts/yekan/YekanBakhFaNum-ExtraBlack.ttf',
      weight: '950',
      style: 'normal',
    },
  ],
  variable: '--font-yekan-bakh',
});

const geistSans = localFont({
  src: '../../fonts/geist/GeistVF.ttf',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../../fonts/geist/GeistMonoVF.ttf',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { data: settings } = await fetchSettingsData();
  const lang = (await params).lang
  const i18n = getI18nInstance(lang)
  return {
    title: {
      default: settings.name || "پروژه کاشی",
      template: `%s | ${settings.name}`,
    },
    icons: {
      icon: settings.favicon || '/favicon1.ico',
    },
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string }
}>) {
  const lang = (await params).lang
  initLingui(lang)
  const [{ data: settings }, showCatalog] = await Promise.all([
    fetchSettingsData(),
    hasCatalogs(),
  ]);

  const primaryColor = process.env.PRIMARY_COLOR || '#CE9F2B';
  const primaryLightColor = process.env.PRIMARY_LIGHT_COLOR || '#FFF6E0';
  const primaryDarkColor = process.env.PRIMARY_DARK_COLOR || '#74560B';
  
  return (
    <SessionProviderWrapper>
      <SetSettings init={settings} />
      <html lang="en" dir={lang === 'en' ? 'ltr' : 'rtl'} style={{ '--primary': `${primaryColor}`, '--primary-light': primaryLightColor, '--primary-dark': primaryDarkColor } as React.CSSProperties}>
        <body
          className={`${yekanBakh.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LinguiClientProvider
            initialLocale={lang}
            initialMessages={allMessages[lang]!}
          >
            <ProgressBar>
              <Toaster position="top-right" />
              <Navbar settings={settings} showCatalog={showCatalog} />
              {children}
              <Footer settings={settings} />
            </ProgressBar>
          </LinguiClientProvider>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
