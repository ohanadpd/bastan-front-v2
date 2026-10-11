import type { CSSProperties } from "react";

type PageHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
  tabletBannerImage?: string | null;
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
    />
  );
}