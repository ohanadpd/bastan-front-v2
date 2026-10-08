import type { CSSProperties } from "react";

type ApplyHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
  tabletBannerImage?: string | null;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
  "--banner-tablet": string;
};

export default function ApplyHero({
  bannerImage,
  mobileBannerImage,
  tabletBannerImage,
}: ApplyHeroProps) {
  const desktopBackground = bannerImage
    ? `url("${bannerImage}")`
    : "none";

  const bannerStyle: BannerStyle = {
    "--banner-desktop": desktopBackground,
    "--banner-mobile": mobileBannerImage
      ? `url("${mobileBannerImage}")`
      : desktopBackground,
    "--banner-tablet": tabletBannerImage
      ? `url("${tabletBannerImage}")`
      : desktopBackground,
  };

  return (
    <header
      className="
        relative h-[550px] bg-cover bg-center
        xl:h-[460px]
        [background-image:var(--banner-mobile)]
        md:[background-image:var(--banner-tablet)]
        xl:[background-image:var(--banner-desktop)]
      "
      style={bannerStyle}
    />
  );
}