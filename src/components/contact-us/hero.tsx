import type { CSSProperties } from "react";

type ContactUsHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
  tabletBannerImage?: string | null;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-tablet": string;
  "--banner-mobile": string;
};

export default function ContactUsHero({
  bannerImage,
  mobileBannerImage,
  tabletBannerImage,
}: ContactUsHeroProps) {
  const desktopBackground = bannerImage
    ? `url("${bannerImage}")`
    : "none";

  const bannerStyle: BannerStyle = {
    "--banner-desktop": desktopBackground,

    "--banner-tablet": tabletBannerImage
      ? `url("${tabletBannerImage}")`
      : desktopBackground,

    "--banner-mobile": mobileBannerImage
      ? `url("${mobileBannerImage}")`
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