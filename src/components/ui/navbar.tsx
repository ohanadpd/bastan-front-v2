"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowDown2, Call, CloseSquare, Element3 } from "iconsax-reactjs";
import { useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";

import { cn } from "@/lib/utils";
import type { SettingsPageData } from "@/types/settings.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import LocalizedLink from "../localized-link";
import I18nSwitcher from "../i18n-switcher";
import I18nSwitcherMobile from "../i18n-switcher-mobile";
import NavDropdownTheme3 from "./nav-dropdown";

interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
  settings: SettingsPageData;
  showCatalog: boolean;
}

type NavbarItem = {
  title: string;
  href: string;
  match?: "exact" | "prefix";
  children?: {
    title: string;
    href: string;
    match?: "exact" | "prefix";
  }[];
};

export default function Navbar({
  className,
  settings,
  showCatalog,
  ...props
}: NavbarProps) {
  const pathname = usePathname();
  const { i18n } = useLingui();

  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const normalizedPathname = useMemo(
    () => (pathname ?? "").replace(/^\/[a-z]{2}(?=\/|$)/, ""),
    [pathname],
  );

  const isNavItemActive = (
    href: string,
    match: NavbarItem["match"] = "prefix",
  ) => {
    if (href === "/") {
      return normalizedPathname === "" || normalizedPathname === "/";
    }

    if (match === "exact") {
      return normalizedPathname === href;
    }

    return (
      normalizedPathname === href ||
      normalizedPathname.startsWith(`${href}/`)
    );
  };

  const navbarItems = useMemo<NavbarItem[]>(() => {
    const items: Array<NavbarItem | false> = [
      {
        title: i18n._(msg`خانه`),
        href: "/",
      },
      {
        title: i18n._(msg`نمایندگی ها`),
        href: "/representatives",
        match: "exact",
      },
      {
        title: i18n._(msg`محصولات`),
        href: "/products",
      },
      {
        title: i18n._(msg`همکاری با ما`),
        href: "#",
        children: [
          {
            title: i18n._(msg`فرصت های شغلی`),
            href: "/careers",
          },
          {
            title: i18n._(msg`دریافت نمایندگی`),
            href: "/representatives/apply",
          },
        ],
      },
      {
        title: i18n._(msg`بلاگ`),
        href: "#",
        children: [
          {
            title: i18n._(msg`اخبار`),
            href: "/news",
          },
          {
            title: i18n._(msg`مقالات`),
            href: "/articles",
          },
        ],
      },
      showCatalog && {
        title: i18n._(msg`کاتالوگ محصولات`),
        href: "/catalog",
      },
      {
        title: i18n._(msg`درباره ما`),
        href: "/about-us",
      },
      {
        title: i18n._(msg`تماس با ما`),
        href: "/contact-us",
      },
    ];

    return items.filter((item): item is NavbarItem => item !== false);
  }, [i18n, showCatalog]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      const clickedInsideMenu = menuRef.current?.contains(event.target);
      const clickedMenuButton = menuButtonRef.current?.contains(event.target);

      if (!clickedInsideMenu && !clickedMenuButton) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
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
    <>
      <nav
        className={cn("fixed left-0 right-0 top-8 z-50", className)}
        {...props}
      >
        <div className="container">
          <div
            className="
              relative flex h-[56px] items-center justify-between
              rounded-[10px] border-[0.5px] border-[#F2F2F2]
              bg-white px-3
              xl:h-[80px] xl:gap-5 xl:px-6
            "
          >
            <div className="hidden min-w-0 items-center gap-5 xl:flex">
              {settings.logo && (
                <LocalizedLink href="/" className="block shrink-0">
                  <Image
                    src={settings.logo}
                    alt={settings.name || "logo"}
                    width={82}
                    height={24}
                    className="object-contain"
                  />
                </LocalizedLink>
              )}

              <ul
                className="
                  flex items-center gap-[16px] whitespace-nowrap
                  text-[14px] font-semibold text-[#252525]
                "
              >
                {navbarItems.map((item, index) => (
                  <NavDropdownTheme3
                    key={`${item.href}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </ul>
            </div>

            <div className="absolute right-3 xl:hidden">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label={
                  isOpen
                    ? i18n._(msg`بستن منو`)
                    : i18n._(msg`باز کردن منو`)
                }
                aria-expanded={isOpen}
                aria-controls="navbar-mobile-menu"
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-[5px] text-[#454545]
                  focus-visible:outline-2 focus-visible:outline-primary
                "
              >
                {isOpen ? (
                  <CloseSquare size={30} color="currentColor" />
                ) : (
                  <Element3 size={30} color="currentColor" />
                )}
              </button>
            </div>

            {settings.favicon && (
              <LocalizedLink
                href="/"
                aria-label={settings.name || i18n._(msg`خانه`)}
                className="
                  absolute left-1/2 top-1/2
                  flex h-10 w-8 -translate-x-1/2 -translate-y-1/2
                  items-center justify-center xl:hidden
                "
              >
                <Image
                  src={settings.favicon}
                  alt={settings.name || "logo"}
                  width={32}
                  height={40}
                  className="h-10 w-8 object-contain"
                />
              </LocalizedLink>
            )}

            <div
              className="
                flex shrink-0 items-center gap-2
                max-xl:absolute max-xl:left-3 max-xl:flex-row-reverse
                max-xl:[direction:ltr]
                xl:gap-4
              "
            >
              <a
                href={`tel:${settings.phone}`}
                className="
                  flex items-center gap-2 rounded-[50px]
                  bg-[#F2F2F2] px-2 py-[6px] text-[#252525]
                  transition-colors hover:text-primary
                  xl:gap-[5px] xl:px-2 xl:py-1
                "
              >
                <span
                  dir="ltr"
                  className="
                    whitespace-nowrap text-[10px] font-medium
                    xl:text-[12px]
                  "
                >
                  {settings.phone}
                </span>

                <Call
                  size={16}
                  color="currentColor"
                  className="hidden shrink-0 xl:block"
                />
              </a>

              <div className="hidden shrink-0 items-center xl:flex">
                <I18nSwitcher />
              </div>

              <LocalizedLink
                href="/visualizer"
                aria-label="کاشی نگار"
                title="کاشی نگار"
                className="
                  group hidden h-10 w-10 shrink-0
                  items-center justify-center rounded-[5px]
                  focus-visible:outline-2
                  focus-visible:outline-primary xl:flex
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    block h-10 w-10 bg-[#353535]
                    transition-colors duration-300
                    group-hover:bg-primary
                    group-focus-visible:bg-primary
                  "
                  style={{
                    maskImage: 'url("/images/icons/Icon.svg")',
                    WebkitMaskImage: 'url("/images/icons/Icon.svg")',
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </LocalizedLink>

              <LocalizedLink
                href="/auth/login"
                aria-label={i18n._(msg`حساب کاربری`)}
                title={i18n._(msg`حساب کاربری`)}
                className="
                  group flex h-8 w-6 shrink-0
                  items-center justify-center rounded-[5px]
                  focus-visible:outline-2
                  focus-visible:outline-primary xl:w-8
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    block h-7 w-6 bg-[#353535]
                    transition-colors duration-300
                    group-hover:bg-primary
                    group-focus-visible:bg-bastan1
                    xl:h-8 xl:w-8
                  "
                  style={{
                    maskImage: 'url("/images/icons/profile.svg")',
                    WebkitMaskImage: 'url("/images/icons/profile.svg")',
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </nav>

      <div
        id="navbar-mobile-menu"
        ref={menuRef}
        aria-hidden={!isOpen}
        className={cn(
          `
            fixed inset-0 z-40 h-fit max-h-screen
            overflow-y-auto bg-white pb-8 pt-24
            transition-all duration-300 ease-in-out
            xl:hidden
          `,
          isOpen
            ? "visible translate-y-0"
            : "invisible pointer-events-none -translate-y-full",
        )}
      >
        <ul
          className="
            container flex flex-col gap-6
            text-[14px] font-semibold text-[#878787]
          "
        >
          {navbarItems.map((item, index) => (
            <li key={`${item.href}-${index}`}>
              {!item.children ? (
                <LocalizedLink
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block",
                    isNavItemActive(item.href, item.match) && "text-primary",
                  )}
                >
                  {item.title}
                </LocalizedLink>
              ) : (
                <Collapsible className="[&[data-state=open]>button>svg]:rotate-180">
                  <CollapsibleTrigger
                    className="
                      flex w-full items-center justify-between
                    "
                  >
                    {item.title}

                    <ArrowDown2 size={16} color="#878787" />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-4">
                    <ul className="space-y-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <LocalizedLink
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block",
                              isNavItemActive(child.href, child.match) &&
                                "text-primary",
                            )}
                          >
                            {child.title}
                          </LocalizedLink>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </li>
          ))}

          <li>
            <I18nSwitcherMobile />
          </li>
        </ul>
      </div>
    </>
  );
}