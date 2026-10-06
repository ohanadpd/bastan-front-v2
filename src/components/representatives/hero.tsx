import type { CSSProperties } from "react";

type AgenciesHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
};

const FALLBACK_BANNER = "/images/representatives-banner.jpg";

export default function AgenciesHero({
  bannerImage,
  mobileBannerImage,
}: AgenciesHeroProps) {
  const desktopBanner = bannerImage || FALLBACK_BANNER;
  const mobileBanner = mobileBannerImage || desktopBanner;

  const bannerStyle: BannerStyle = {
    "--banner-desktop": `url("${desktopBanner}")`,
    "--banner-mobile": `url("${mobileBanner}")`,
  };

  return (
    <header
      className="
        relative h-[550px] xl:h-[460px] w-full bg-cover bg-cent=er
        [background-image:var(--banner-mobile)]
        md:[background-image:var(--banner-desktop)]
      "
      style={bannerStyle}
    />
  );
}