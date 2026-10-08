import type { CSSProperties } from "react";

type NewsHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
  tabletBannerImage?: string | null;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
  "--banner-tablet": string;
};

const FALLBACK_BANNER = "/images/news-banner.jpg";

export default function NewsHero({
  bannerImage,
  mobileBannerImage,
  tabletBannerImage,
}: NewsHeroProps) {
  const desktopBanner = bannerImage || FALLBACK_BANNER;
  const mobileBanner = mobileBannerImage || desktopBanner;
  const tabletBanner = tabletBannerImage || desktopBanner;

  const bannerStyle: BannerStyle = {
    "--banner-desktop": `url("${desktopBanner}")`,
    "--banner-mobile": `url("${mobileBanner}")`,
    "--banner-tablet": `url("${tabletBanner}")`,
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