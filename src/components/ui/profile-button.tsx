'use client'
// this is a client component because it uses the `useState` hook

import { useState, useRef, useEffect } from 'react'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Profile } from 'iconsax-reactjs'
import { Trans } from '@lingui/react/macro'
import Link from '@/components/localized-link'
import { Button } from './button'
import { signOut, useSession } from 'next-auth/react'

export default function ProfileButton() {
    const { data: session } = useSession()
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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
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
        <div className="size-5" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                <Profile size={20} color='currentColor' />
            </button>

            <div
                className={cn(
                    "absolute flex flex-col top-full min-w-[120px] bg-[#2F3A41] z-50 overflow-hidden end-0 p-4",
                    "transition-all duration-200 origin-top",
                    isOpen
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                )}
            >
                {session && <>
                    <Link
                        href='/profile'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            پروفایل
                        </Trans>
                    </Link>
                    <Link
                        href='/profile/change-password'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            تغییر رمز عبور
                        </Trans>
                    </Link>
                    <Link
                        href='/profile/addresses'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            آدرس های من
                        </Trans>
                    </Link>
                    {/* <Link
                        href='/profile/favorite'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            محصولات مورد علاقه
                        </Trans>
                    </Link> */}
                    <Link
                        href='/profile/orders'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            سفارشات
                        </Trans>
                    </Link>
                    <Link
                        href='/cart'
                        className={cn(
                            "lg:hidden flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            سبد خرید
                        </Trans>
                    </Link>
                    <span
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={cn(
                            "cursor-pointer flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                    >
                        <Trans>
                            خروج
                        </Trans>
                    </span>
                </>}
                {!session && <>
                    <Link
                        href='/auth/login'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            ورود
                        </Trans>
                    </Link>
                    <Link
                        href='/auth/register'
                        className={cn(
                            "flex items-center gap-3 px-3 text-sm text-start py-2 text-white",
                            "transition-colors duration-200",
                            "hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Trans>
                            ثبت نام
                        </Trans>
                    </Link>
                </>}

            </div>
        </div>
    )
}