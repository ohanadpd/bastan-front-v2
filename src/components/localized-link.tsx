"use client";

import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { AnchorHTMLAttributes, ReactNode } from "react";

interface LocalizedLinkProps
  extends Omit<LinkProps, "href">,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

/** Paths that must not get a locale prefix (already absolute on the web or special schemes). */
function resolveLocalizedHref(locale: string, href: string): string {
  if (/^(https?:\/\/|\/\/|mailto:|tel:)/i.test(href)) {
    return href;
  }
  if (href.startsWith("/")) {
    return `/${locale}${href}`;
  }
  return `/${locale}/${href}`;
}

export default function LocalizedLink({
  href,
  children,
  ...props
}: LocalizedLinkProps) {
  const params = useParams();
  const locale = (params?.lang as string) || "fa"; // fallback

  return (
    <Link href={resolveLocalizedHref(locale, href)} {...props}>
      {children}
    </Link>
  );
}
