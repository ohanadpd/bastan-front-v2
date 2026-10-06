"use client";

import { useEffect, useId, useRef, useState } from "react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowDown2 } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

const languages = {
  en: msg`انگلیسی`,
  fa: msg`فارسی`,
  ar: msg`عربی`,
} as const;

type Locale = keyof typeof languages;

const localeKeys = Object.keys(languages) as Locale[];

function isLocale(value: string): value is Locale {
  return localeKeys.includes(value as Locale);
}

export default function I18nSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useLingui();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownId = useId();

  const pathLocale = (pathname ?? "/").split("/")[1];

  const locale: Locale = isLocale(pathLocale)
    ? pathLocale
    : isLocale(i18n.locale)
      ? i18n.locale
      : "fa";

  function handleChange(newLocale: Locale) {
    setIsOpen(false);

    if (newLocale === locale) return;

    const segments = (pathname ?? "/").split("/");
    const firstSegment = segments[1];

    if (isLocale(firstSegment) || firstSegment === "pseudo") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join("/") || `/${newLocale}`;

    router.push(
      `${newPath}${window.location.search}${window.location.hash}`,
    );
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={i18n._(msg`تغییر زبان`)}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        onClick={() => setIsOpen((previous) => !previous)}
        dir="ltr"
        className="
          flex h-8 items-center justify-center gap-1
          rounded-[5px] text-[#252525]
          transition-colors duration-200 hover:text-primary
          focus-visible:outline-2 focus-visible:outline-primary
        "
      >
        <span className="relative block h-[18px] w-[18px] shrink-0 overflow-hidden rounded-full">
          <Image
            src={`/images/flags/${locale}.png`}
            alt={i18n._(languages[locale])}
            fill
            sizes="18px"
            className="object-cover object-center"
          />
        </span>

        <ArrowDown2
          size={12}
          color="currentColor"
          className={cn(
            "shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        id={dropdownId}
        aria-hidden={!isOpen}
        className={cn(
          `
            absolute end-0 top-full z-50 mt-2
            flex min-w-[140px] origin-top flex-col
            overflow-hidden rounded-[10px]
            border border-[#F2F2F2] bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            transition-all duration-200
          `,
          isOpen
            ? "visible translate-y-0 scale-y-100 opacity-100"
            : "invisible pointer-events-none -translate-y-2 scale-y-95 opacity-0",
        )}
      >
        {localeKeys.map((lang) => (
          <button
            key={lang}
            type="button"
            tabIndex={isOpen ? 0 : -1}
            aria-pressed={locale === lang}
            onClick={() => handleChange(lang)}
            className={cn(
              `
                flex items-center gap-3 px-3 py-3
                text-start text-[13px]
                transition-colors duration-200
                hover:bg-[#F7F7F7] hover:text-primary
                focus-visible:outline-2
                focus-visible:outline-offset-[-2]
                focus-visible:outline-primary
              `,
              locale === lang
                ? "bg-[#F7F7F7] font-semibold text-primary"
                : "text-[#252525]",
            )}
          >
            <span className="relative block h-5 w-5 shrink-0 overflow-hidden rounded-full">
              <Image
                src={`/images/flags/${lang}.png`}
                alt=""
                fill
                sizes="20px"
                className="object-cover object-center"
              />
            </span>

            <span>{i18n._(languages[lang])}</span>
          </button>
        ))}
      </div>
    </div>
  );
}