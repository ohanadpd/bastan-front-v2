import type { CSSProperties } from "react";
import { Trans } from "@lingui/react/macro";
import Link from "@/components/localized-link";

type ApplyHeroProps = {
  bannerImage?: string | null;
  mobileBannerImage?: string | null;
};

type BannerStyle = CSSProperties & {
  "--banner-desktop": string;
  "--banner-mobile": string;
};

export default function ApplyHero({
  bannerImage,
  mobileBannerImage,
}: ApplyHeroProps) {
  const desktopBackground = bannerImage
    ? `url("${bannerImage}")`
    : "none";

  const bannerStyle: BannerStyle = {
    "--banner-desktop": desktopBackground,
    "--banner-mobile": mobileBannerImage
      ? `url("${mobileBannerImage}")`
      : desktopBackground,
  };

  return (
    <header
      className="
        relative h-[550px] xl:h-[460px] bg-cover bg-center
        [background-image:var(--banner-mobile)]
        md:[background-image:var(--banner-desktop)]
      "
      style={bannerStyle}
    >
      {/* <div className="absolute inset-0 bg-black/60" />

      <div className="container relative z-10 flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-extrabold text-white xl:text-[32px]">
          <Trans>دریافت نمایندگی</Trans>
        </h1>

        <p className="text-sm text-white xl:text-lg">
          {subtitle}
        </p>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 xl:start-0 xl:left-auto xl:translate-x-0">
          <span className="text-sm text-white">
            <Link href="/">
              <Trans>خانه</Trans>
            </Link>{" "}
            /
          </span>

          <span className="text-sm text-white">
            {" "}
            <Trans>دریافت نمایندگی</Trans>
          </span>
        </div>
      </div> */}
    </header>
  );
}