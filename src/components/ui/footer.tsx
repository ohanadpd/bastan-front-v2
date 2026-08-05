import * as React from 'react';
import Image from 'next/image';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button } from './button';
import Link from 'next/link';
import Form from 'next/form'
import { msg } from '@lingui/core/macro'
import OhanaLogo from './ohana-logo';
import { SettingsPageData, LinkItem } from '@/types/settings.types';
import { getMediaUrl } from '@/lib/utils';
import FooterNewsletter from './newsletter';

export default function Footer({ settings }: { settings: SettingsPageData }) {
    const { i18n } = useLingui()

    // Memoize the grouped links to prevent unnecessary recalculations
    const groupedLinksArray = React.useMemo(() => {
        const groupedLinks = settings.links.reduce((groups, item) => {
            const catTitle = item.category.title;
            if (!groups[catTitle]) {
                groups[catTitle] = [];
            }
            groups[catTitle].push(item);
            return groups;
        }, {} as Record<string, LinkItem[]>);

        return Object.entries(groupedLinks).map(([category, items]) => ({
            category,
            items
        }));
    }, [settings.links]);

    return (
        <footer className='bg-[#313131] pt-[51px]'>
            <div className='flex flex-col container'>
                {(settings.logo_footer || settings.logo) && <div className='relative h-[72px]'>
                    <Image src={getMediaUrl(settings.logo_footer ? settings.logo_footer : settings.logo)} alt={"logo"} fill className='object-contain' />
                </div>}
                <p className='text-center max-w-[587px] text-white mx-auto mt-10'>
                    {settings.text}
                </p>
                <FooterNewsletter />
                <div className='flex flex-col xl:flex-row gap-4 flex-wrap items-start justify-center mt-12'>
                    {
                        groupedLinksArray.map((item, index) => (
                            <div key={index} className='flex flex-col gap-4 w-full xl:max-w-[268px]'>
                                <h3 className='text-white font-bold text-sm pb-4 border-b-[0.6px] border-white'>
                                    {item.category}
                                </h3>
                                <div className='flex flex-col gap-5 text-sm text-white'>
                                    {item.items.map(link => (
                                        <Link key={link.id} href={link.link}>
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                    <div className='flex flex-col gap-4 w-full xl:max-w-[268px]'>
                        <h3 className='text-white font-bold text-sm pb-4 border-b-[0.6px] border-white'>
                            <Trans>ارتباط با ما</Trans>
                        </h3>
                        <div className='flex flex-col gap-5 text-sm text-white'>
                            <div className='flex items-center justify-between text-sm text-white'>
                                <h4>
                                    <Trans>تلفن تماس</Trans>:
                                </h4>
                                <p dir='ltr'>
                                    {settings.phone}
                                </p>
                            </div>
                            <div className='flex items-center justify-between text-sm text-white'>
                                <h4>
                                    <Trans>ایمیل</Trans>:
                                </h4>
                                <p>
                                    {settings.email}
                                </p>
                            </div>
                            <div className='flex justify-between text-sm text-white gap-10'>
                                <h4>
                                    <Trans>آدرس</Trans>:
                                </h4>
                                <p className='text-end'>
                                    {settings.adresses}
                                </p>
                            </div>
                            <div className='flex items-center gap-4 mt-1'>
                                {settings.socials.filter(item => item.display_section === 'both' || item.display_section === 'footer').map((social, index) => (
                                    social.dark_icon && social.link && <Link key={index} href={social.link}>
                                        <div className='relative w-8 h-8'>
                                            <Image src={getMediaUrl(social.dark_icon)} alt={social.name} fill className='object-contain' />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='group mt-7 bg-[#525252] h-14 text-sm text-[#D7D7D7]'>
                <a href="https://ohanaa.ir/" target='_blank' className='h-full flex justify-center items-center gap-3 hover:text-[#D7D7D7] transition-all duration-300'>
                    <p className=''>
                        <Trans>طراحی و توسعه توسط <span className='group-hover:text-[#B800DB] transition-all duration-300'>استودیو اوهانا</span></Trans>
                    </p>
                    <OhanaLogo width={12} height={25} className='w-auto h-auto' />
                </a>
            </div>
        </footer>
    );
}