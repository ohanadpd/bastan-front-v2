import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import ApplyForm from '@/components/representatives/apply-form';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApplyLegalForm from '@/components/representatives/apply-legal-form';
import { fetchGetRepresentationPageDetails } from '@/lib/services/representation.services';
import Link from '@/components/localized-link';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';
import ApplyHero from '@/components/representatives/ApplyHero';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`دریافت نمایندگی`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function ApplyPage({ params }: PageProps) {
    const { lang } = await params;
    initLingui(lang);

    const { data: pageDetails } = await fetchGetRepresentationPageDetails()

    return (
        <main className='pb-[118px]'>
            <ApplyHero
                bannerImage={pageDetails.banner_image}
                mobileBannerImage={pageDetails.banner_image_mobile}
                tabletBannerImage={pageDetails.banner_image_tablet}
                />
            <div className='container mt-11 max-w-[930px] mx-auto'>
                <h2 className='text-[28px] font-extrabold text-[#252525] text-center'>
                    <Trans>این فرصت برای شماست</Trans>
                </h2>
                <div className='mt-6 text-[#424141] xl:text-center' dangerouslySetInnerHTML={{__html: pageDetails?.text || ""}} />
            </div>
            <div className='container mt-20 max-w-[930px] mx-auto'>
                <h2 className='text-2xl font-extrabold text-[#252525] text-center'>
                    <Trans>درخواست نمایندگی</Trans>
                </h2>
                <div className='flex justify-center'>
                    <Tabs dir={lang === "fa" ? "rtl" : "ltr"} defaultValue="natural" className='w-full'>
                        <TabsList className='flex justify-center xl:w-fit mx-auto mt-4 [&>*[data-state=active]]:bg-primary [&>*[data-state=active]]:text-white [&>*]:!w-full [&>*]:xl:px-10 [&>*]:xl:py-2'>
                            <TabsTrigger value="natural" className=''>
                                <Trans>
                                    شخص حقیقی
                                </Trans>
                            </TabsTrigger>
                            <TabsTrigger value="legal">
                                <Trans>
                                    شخص حقوقی
                                </Trans>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="natural">
                            <div className='mt-12'>
                                <ApplyForm />
                            </div>
                        </TabsContent>
                        <TabsContent value="legal">
                            <div className='mt-12'>
                                <ApplyLegalForm />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>


            </div>
        </main>
    );
}