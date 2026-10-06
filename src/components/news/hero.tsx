import type { CSSProperties } from "react";

type NewsHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
};

const FALLBACK_BANNER = "/images/news-banner.jpg";

export default function NewsHero({
  bannerImage,
  mobileBannerImage,
}: NewsHeroProps) {
  const desktopBanner = bannerImage || FALLBACK_BANNER;
  const mobileBanner = mobileBannerImage || desktopBanner;

  const bannerStyle: BannerStyle = {
    "--banner-desktop": `url("${desktopBanner}")`,
    "--banner-mobile": `url("${mobileBanner}")`,
  };

  return (
    <header
      className="
        relative h-[550px] xl:h-[460px] w-full bg-cover bg-center
        [background-image:var(--banner-mobile)]
        md:[background-image:var(--banner-desktop)]
      "
      style={bannerStyle}
    />
  );
}