import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import Image from 'next/image';
import ContactUsMapWrapper from '@/components/contact-us/map-wrapper';
import { Call, Google, Whatsapp } from 'iconsax-reactjs';
import ContactUsForm from '@/components/contact-us/contact-us-form';
import { fetchSettingsData } from '@/lib/services/settigns.services';
import { fetchContactUsPage } from '@/lib/services/contact-us.services';
import Link from '@/components/localized-link'
import { getMediaUrl } from '@/lib/utils';
import ContactUsHero from '@/components/contact-us/hero';

export async function generateMetadata() {
    const { data } = (await fetchContactUsPage())
    return {
        title: data.page_title,
        description: data.page_description,
        keywords: data.page_keywords,
        openGraph: {
            title: data.page_title,
            description: data.page_description,
        },
    }
}

interface PageProps {
    params: Promise<{
        lang: string
    }>;
}

export default async function ContactUsPage({ params }: PageProps) {
    const { lang } = await params;
    const i18n = initLingui(lang);
    const { data: setting } = await fetchSettingsData();
    const { data } = await fetchContactUsPage()

    return (
        <main className='pb-[155px]'>
            <ContactUsHero
                bannerImage={data.banner_image}
                mobileBannerImage={data.banner_image_mobile}
                />
            {setting.latitude && setting.longitude && <section className='container mt-[46px]'>
                <h3 className='text-lg xl:text-xl font-bold text-[#010101] text-center'>
                    <Trans>آدرس کارخانه</Trans>
                </h3>
                <div className='mt-12 h-[453px]'>
                    <ContactUsMapWrapper longitude={setting.longitude} latitude={setting.latitude} />
                </div>
            </section>}
            <section className='container mt-[66px]'>
                <div className='flex flex-col xl:flex-row flex-wrap xl:justify-center gap-5'>
                    {setting.socials.filter(item => item.display_section === 'both' || item.display_section === 'contact_us').map((item, idx) => (
                        <div key={idx} className='group w-full xl:w-[calc(25%-15px)] flex flex-col justify-center items-center bg-white border-[0.6px] border-[#BEBEBE] hover:border-primary transition-all duration-300 h-[145px] rounded-[5px]'>
                            <div className='flex flex-col items-center gap-2'>
                                <span className='text-[#292D32] group-hover:text-primary transition-all duration-300'>
                                    {item.light_icon && <Image src={getMediaUrl(item.light_icon)} alt={item.name} width={24} height={24} />}
                                </span>
                                <h3 className='text-sm font-semibold'>
                                    {item.name}
                                </h3>
                            </div>
                            <span className='block text-sm text-[#3B3B3B] mt-4'>
                                <a href={item.link || '#'} target='_blank'>{item.username_or_id || '-'}</a>
                            </span>
                        </div>
                    ))}
                </div>
            </section>
            <section className='container mt-[88px]'>
                <h3 className='text-lg xl:text-xl font-bold text-center'>
                    <Trans>
                        با ما در ارتباط باشید
                    </Trans>
                </h3>
                <p className='text-center text-sm text-[#484848] mt-2'>
                    <Trans>جهت ارتباط مستقیم با شرکت فرم زیر را تکمیل فرمایید</Trans>
                </p>
                <div className='mt-8 xl:max-w-[930px] mx-auto'>
                    <ContactUsForm />
                </div>
            </section>
        </main>
    );
}