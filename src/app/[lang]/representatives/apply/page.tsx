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
            <header className='relative h-[464px] bg-cover bg-center' style={{ backgroundImage: pageDetails.banner_image ? `url(${pageDetails.banner_image})` : '' }}>
                <div className='absolute inset-0 bg-black/60'></div>
                <div className='w-full h-full flex flex-col justify-center items-center gap-2 container relative z-10'>
                    <h1 className='text-white text-2xl xl:text-[32px] font-extrabold'>
                        <Trans>
                            دریافت نمایندگی
                        </Trans>
                    </h1>
                    <p className='text-white text-sm xl:text-lg'>
                        {pageDetails.sub_title}
                    </p>
                    <div className='absolute bottom-5 left-1/2 -translate-x-1/2 xl:left-auto xl:start-0 xl:translate-x-0'>
                        <span className='text-white text-sm'>
                            <Link href='/'><Trans>خانه</Trans></Link> /
                        </span>
                        <span className='text-white text-sm'>
                            <Trans>دریافت نمایندگی</Trans>
                        </span>
                    </div>
                </div>
            </header>
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