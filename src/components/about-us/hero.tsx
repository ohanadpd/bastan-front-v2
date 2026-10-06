import type { CSSProperties } from "react";
import { fetchAboutUsPage } from "@/lib/services/about-us.services";

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
};

const FALLBACK_BANNER = "/images/about-us-banner.jpg";

export default async function AboutUsHeroTheme() {
  let desktopBanner = FALLBACK_BANNER;
  let mobileBanner = FALLBACK_BANNER;

  try {
    const { data } = await fetchAboutUsPage();

    desktopBanner = data.banner_image || FALLBACK_BANNER;
    mobileBanner = data.banner_image_mobile || desktopBanner;
  } catch (error) {
    console.error("Failed to load about us banners:", error);
  }

  const bannerStyle: BannerStyle = {
    "--banner-desktop": `url("${desktopBanner}")`,
    "--banner-mobile": `url("${mobileBanner}")`,
  };

  return (
    <header
      className="
        relative h-[550] xl:h-[460px]  w-full bg-cover bg-center
        [background-image:var(--banner-mobile)]
        md:[background-image:var(--banner-desktop)]
      "
      style={bannerStyle}
    />
  );
}