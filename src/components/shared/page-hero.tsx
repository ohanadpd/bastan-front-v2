import type { CSSProperties } from "react";
import Link from "@/components/localized-link";

type PageHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
  tabletBannerImage?: string | null;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  homeLabel?: string;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-tablet": string;
  "--banner-mobile": string;
};

const FALLBACK_BANNER = "/images/default-banner.png";

export default function PageHero({
  bannerImage,
  mobileBannerImage,
  tabletBannerImage,
  breadcrumbs = [],
  homeLabel = "خانه",
}: PageHeroProps) {
  const desktopBanner = bannerImage || FALLBACK_BANNER;

  const bannerStyle: BannerStyle = {
    "--banner-desktop": `url("${desktopBanner}")`,
    "--banner-tablet": `url("${tabletBannerImage || desktopBanner}")`,
    "--banner-mobile": `url("${mobileBannerImage || desktopBanner}")`,
  };

  return (
    <header
      className="
        relative h-[550px] w-full bg-cover bg-center
        xl:h-[460px]
        [background-image:var(--banner-mobile)]
        md:[background-image:var(--banner-tablet)]
        xl:[background-image:var(--banner-desktop)]
      "
      style={bannerStyle}
    >
      {breadcrumbs.length > 0 && (
        <div className="container absolute inset-x-0 bottom-4">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex rounded-[18px] bg-[#FFFFFFCF] px-[18px] py-[10px] text-[12px]"
          >
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="text-[#000000]">
                  {homeLabel}
                </Link>
              </li>

              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li
                    key={`${item.label}-${index}`}
                    className="flex items-center gap-1"
                  >
                    <span aria-hidden="true" className="text-[#000000]">
                      /
                    </span>

                    {item.href && !isLast ? (
                      <Link href={item.href} className="text-[#010101]">
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? "page" : undefined}
                        className="text-primary"
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      )}
    </header>
  );
}