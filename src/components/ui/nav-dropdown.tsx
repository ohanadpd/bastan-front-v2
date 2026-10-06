'use client';
import { cn } from '@/lib/utils';
import { ArrowDown2 } from 'iconsax-reactjs';
import { default as Link } from '@/components/localized-link';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavItem = {
    title: string
    href: string
    match?: 'exact' | 'prefix'
    children?: { title: string; href: string; match?: 'exact' | 'prefix' }[]
}

export default function NavDropdown({ item, index }: { item: NavItem, index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname()
    const normalizedPathname = (pathname ?? '').replace(/^\/[a-z]{2}(?=\/|$)/, '')

    const isNavItemActive = (href: string, match: NavItem['match'] = 'prefix') => {
        if (href === '/') return pathname === '/' || Boolean(pathname?.match(/^\/[a-z]{2}$/))
        if (match === 'exact') return normalizedPathname === href
        return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`)
    }
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
        <div className='relative' ref={menuRef}>
            {item.children && item.children.length > 0 ? (
                <div className='relative z-50'>
                    <li key={index} className='flex items-center gap-1 primary-hover cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                        {item.title}
                        <ArrowDown2 size={16} color="currentColor" className='font-bold' />
                    </li>
                </div>
            ) : (
                <li key={index} className={cn('flex items-center gap-1 primary-hover', isNavItemActive(item.href, item.match) ? 'text-primary' : '')} onClick={() => setIsOpen(!isOpen)}>
                    <Link href={item.href} className='relative z-50'>
                        {item.title}
                    </Link>
                </li>
            )}
            {item.children && item.children.length > 0 && <ul className={cn('absolute top-[calc(100%+32px)] bg-white backdrop-blur-[16.9px] start-0 w-fit min-w-[200px] p-4 text-nowrap py-5 px-8 space-y-[18px] transition-all duration-300 ease-in-out', isOpen ? 'opacity-100 scale-y-100' : 'scale-90 opacity-0 -z-50')}>
                {
                    item.children && item.children.map((child, index) => (
                        isOpen && <li key={index} className={cn('primary-hover', isNavItemActive(child.href, child.match) ? 'text-primary' : '')}>
                            <Link href={child.href} onClick={() => setIsOpen(false)}>
                                {child.title}
                            </Link>
                        </li>
                    ))
                }
            </ul>}
        </div>
    );
}