'use client';
import { cn } from '@/lib/utils';
import { ArrowDown2, Bag2, Call, CloseSquare, Element3, Profile } from 'iconsax-reactjs';
import * as React from 'react';
import Image from 'next/image';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import NavDropdown from './nav-dropdown';
import LocalizedLink from '../localized-link';
import I18nSwitcher from '../i18n-switcher';
import { usePathname } from 'next/navigation';
import I18nSwitcherMobile from '../i18n-switcher-mobile';
import { Trans, useLingui, } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro'
import ProfileButton from './profile-button';
import Link from '@/components/localized-link'

import { SettingsPageData } from '@/types/settings.types';
const isShoppingMode = process.env.NEXT_PUBLIC_IS_SHOPPING_MODE === 'true';

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
    settings: SettingsPageData
    /** From server: whether the catalog menu item should appear */
    showCatalog: boolean
}

type NavbarItem = {
    title: string;
    href: string;
    match?: 'exact' | 'prefix';
    children?: { title: string; href: string; match?: 'exact' | 'prefix' }[];
};

export default function Navbar({ className, settings, showCatalog, ...props }: NavbarProps) {
    const pathname = usePathname()
    const { i18n } = useLingui()
    const normalizedPathname = useMemo(
        () => (pathname ?? '').replace(/^\/[a-z]{2}(?=\/|$)/, ''),
        [pathname]
    )

    const isNavItemActive = (href: string, match: NavbarItem['match'] = 'prefix') => {
        if (href === '/') return pathname === '/' || Boolean(pathname?.match(/^\/[a-z]{2}$/))

        if (match === 'exact') return normalizedPathname === href

        // prefix match: "/products" should be active for "/products" and "/products/slug"
        return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`)
    }

    const navbarItems = useMemo<NavbarItem[]>(() => {
        const items: Array<NavbarItem | false> = [
            {
                title: i18n._(msg`خانه`),
                href: '/'
            },
            {
                title: i18n._(msg`نمایندگی ها`),
                href: '/representatives',
                match: 'exact'
            },
            {
                title: i18n._(msg`محصولات`),
                href: '/products'
            },
            {
                title: i18n._(msg`همکاری با ما`),
                href: '#',
                children: [
                    {
                        title: i18n._(msg`فرصت های شغلی`),
                        href: '/careers'
                    },
                    {
                        title: i18n._(msg`دریافت نمایندگی`),
                        href: '/representatives/apply'
                    },
                ]
            },
            {
                title: i18n._(msg`بلاگ`),
                href: '#',
                children: [
                    {
                        title: i18n._(msg`اخبار`),
                        href: '/news'
                    },
                    {
                        title: i18n._(msg`مقالات`),
                        href: '/articles'
                    },

                ]
            },

            showCatalog && {
                title: i18n._(msg`کاتالوگ محصولات`),
                href: '/catalog'
            },
            {
                title: i18n._(msg`درباره ما`),
                href: '/about-us'
            },
            {
                title: i18n._(msg`تماس با ما`),
                href: '/contact-us'
            }
        ]

        return items.filter(Boolean) as NavbarItem[]
    }, [i18n, showCatalog])

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <nav className={cn('inset-x-0 h-16 xl:h-[89px] fixed top-0 left-0 z-50', isOpen ? 'bg-white' : 'bg-[#2F3A41]/60 backdrop-blur-[16.9px]', className)} {...props}>
                <div className="relative container flex items-center justify-between h-full">
                    {isOpen ? <CloseSquare size={24} color="#292D32" className='xl:hidden' onClick={() => setIsOpen(false)} /> : <Element3 size={24} color="#fff" className='xl:hidden' onClick={() => setIsOpen(true)} />}
                    {settings.favicon && <Image src={settings.favicon} alt={settings.name || 'logo'} width={32} height={32} className='absolute left-1/2 -translate-x-1/2 xl:hidden' />}
                    <div className='hidden xl:flex items-center gap-6'>
                        {settings.logo && <LocalizedLink href="/">
                            <Image src={settings.logo} alt={settings.name || 'logo'} width={74} height={22} />
                        </LocalizedLink>}
                        <ul className='flex items-center gap-6 font-semibold text-sm text-white'>
                            {
                                navbarItems.map((item, index) => (
                                    <NavDropdown key={index} item={item} index={index} />
                                ))
                            }
                        </ul>
                    </div>
                    <div className={cn('flex items-center', isShoppingMode ? 'gap-4' : 'gap-6')}>
                        <div className='hidden xl:block'>
                            <I18nSwitcher />
                        </div>

                        <div className='hidden lg:flex items-center gap-1 primary-hover text-white'>
                            <span dir='ltr' className={cn('font-semibold text-sm', isOpen ? 'text-[#292D32]' : '')}>
                                {settings.phone}
                            </span>
                            <Call size={16} color={isOpen ? '#292D32' : 'currentColor'} />
                        </div>
                        {isShoppingMode && <>
                            <Link href='/cart' className='text-white hover:text-primary transition-all duration-300 hidden lg:block'>
                                <Bag2 size={20} color='currentColor' />
                            </Link>
                            <div className='text-white hover:text-primary transition-all duration-300'>
                                {/* <Profile size={20} color='currentColor' /> */}
                                <ProfileButton />
                            </div>
                        </>}
                    </div>
                </div>
            </nav>
            <div ref={menuRef} className={cn('fixed top-0 inset-0 h-fit bg-white z-40 transition-all duration-300 ease-in-out pt-20 pb-8 max-h-screen overflow-y-scroll', isOpen ? 'translate-y-0' : '-translate-y-full')}>
                <ul className='container flex flex-col gap-6 text-[#878787] text-sm font-semibold'>
                    {
                        navbarItems.map((item, index) => (
                            !item.children ?
                                (
                                    <li key={index} className={cn(isNavItemActive(item.href, item.match) ? 'text-primary' : '')}>
                                        <LocalizedLink href={item.href} onClick={() => setIsOpen(false)}>
                                            {item.title}
                                        </LocalizedLink>
                                    </li>
                                ) :
                                item.children.length > 0 &&
                                (
                                    <Collapsible key={index} className='[&[data-state="open"]>button>svg]:rotate-180'>
                                        <CollapsibleTrigger className='w-full flex items-center justify-between'>
                                            {item.title}
                                            <ArrowDown2 size={16} color="#878787" className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className='collapsible-content space-y-4 [&>li:first-child]:pt-4'>
                                            {
                                                item.children.map((child, index) => (
                                                    <li key={index} className={cn(isNavItemActive(child.href, child.match) ? 'text-primary' : '')}>
                                                        <LocalizedLink href={child.href} onClick={() => setIsOpen(false)}>
                                                            {child.title}
                                                        </LocalizedLink>
                                                    </li>
                                                ))
                                            }
                                        </CollapsibleContent>
                                    </Collapsible>
                                )
                        ))
                    }
                    <I18nSwitcherMobile />
                </ul>
            </div>
        </>
    );
}