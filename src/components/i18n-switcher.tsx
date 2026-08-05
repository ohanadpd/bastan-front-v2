'use client'
// this is a client component because it uses the `useState` hook

import { useState, useRef, useEffect } from 'react'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ArrowDown2 } from 'iconsax-reactjs'

type LOCALES = 'fa' | 'en' | 'ar' | 'pseudo'

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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-fit h-8 text-sm px-2 flex items-center gap-2 text-white primary-hover"
            >
                {locale.toUpperCase()}
                <ArrowDown2 size={16} color="currentColor" />

            </button>

            <div
                className={cn(
                    "absolute flex flex-col top-full min-w-[120px] bg-[#2F3A41] z-50 overflow-hidden",
                    "transition-all duration-200 origin-top",
                    isOpen
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                )}
            >
                {Object.keys(languages).map((lang) => (
                    <button
                        key={lang}
                        onClick={() => handleChange(lang)}
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-4 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary",
                            locale === lang ? "text-primary" : ""
                        )}
                    >
                        <span className='relative size-5 rounded-full overflow-hidden shrink-0'>
                            <Image src={`/images/flags/${lang}.png`} alt={lang} fill className='object-cover object-center' />
                        </span>
                        {i18n._(languages[lang as keyof typeof languages])}
                    </button>
                ))}
            </div>
        </div>
    )
}