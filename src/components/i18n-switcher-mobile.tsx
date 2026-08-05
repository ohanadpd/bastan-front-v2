'use client'
// this is a client component because it uses the `useState` hook

import { useState, useRef, useEffect } from 'react'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ArrowDown2, Global } from 'iconsax-reactjs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

const languages = {
    en: msg`انگلیسی`,
    fa: msg`فارسی`,
    ar: msg`عربی`,
} as const

export default function I18nSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const { i18n } = useLingui()
    const pathname = usePathname()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const locale = pathname?.split('/')[1] || 'fa'

    // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
    // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    //   languages['pseudo'] = t`Pseudo`
    // }

    const handleChange = (newLocale: string) => {
        const newPath = pathname?.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPath)
        setIsOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="" ref={dropdownRef}>
            <Collapsible className='[&[data-state="open"]>button>svg]:rotate-180'>
                <CollapsibleTrigger className='w-full flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <Global size={16} color="#878787" className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} />
                        <span className='font-semibold text-sm'>
                            FA
                        </span>
                    </div>
                    <ArrowDown2 size={16} color="#878787" className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} />
                </CollapsibleTrigger>
                <CollapsibleContent className='collapsible-content space-y-4 [&>li:first-child]:pt-4'>
                    {Object.keys(languages).map((lang) => (
                        <li key={lang}>
                            <button onClick={() => handleChange(lang)} className={cn(locale === lang ? 'text-primary' : '')}>
                                {i18n._(languages[lang as keyof typeof languages])}
                            </button>
                        </li>
                    ))}

                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}