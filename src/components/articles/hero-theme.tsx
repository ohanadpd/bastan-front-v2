import type { CSSProperties } from "react";
import { fetchArticlePageDetails } from "@/lib/services/articles.services";

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
};

const FALLBACK_BANNER = "/images/articles-banner.jpg";

export default async function ArticlesHeroTheme() {
  let desktopBanner = FALLBACK_BANNER;
  let mobileBanner = FALLBACK_BANNER;

  try {
    const { data } = await fetchArticlePageDetails();

    desktopBanner = data.banner_image || FALLBACK_BANNER;
    mobileBanner = data.banner_image_mobile || desktopBanner;
  } catch (error) {
    console.error("Failed to load articles banners:", error);
  }

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