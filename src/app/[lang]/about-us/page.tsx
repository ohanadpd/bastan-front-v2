import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";
import Image from "next/image";
import { msg } from "@lingui/core/macro";

import AchievementsSlider from "@/components/about-us/achievements-slider";
import { fetchAboutUsPage } from "@/lib/services/about-us.services";
import { getMediaUrl } from "@/lib/utils";
import PageHero from "@/components/shared/page-hero";
import PhotoAlbum, {
  type AlbumImage,
} from "@/components/about-us/photo-album";

export async function generateMetadata() {
  const { data } = await fetchAboutUsPage();

  return {
    title: data.page_title,
    description: data.page_description,
    keywords: data.page_keywords,
    openGraph: {
      title: data.page_title,
      description: data.page_description,
    },
  };
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AboutUsPage({ params }: PageProps) {
  const { data } = await fetchAboutUsPage();
  const { lang } = await params;

  const i18n = initLingui(lang);

 const tallImageIndexes = new Set([0, 2, 5]);

const albumImages: AlbumImage[] = (data.about_galleries ?? [])
  .filter((item) => item.publish && item.image)
  .map((item, index) => ({
    id: String(item.id),
    src: getMediaUrl(item.image),
    alt: item.alt || i18n._(msg`تصاویر باستان`),
    tall: tallImageIndexes.has(index % 9),
    videoUrl: item.link?.trim() || undefined,
  }));

  return (
    <main className="pb-[155px]">
      <PageHero
        bannerImage={data.banner_image}
        mobileBannerImage={data.banner_image_mobile}
        tabletBannerImage={data.banner_image_tablet}
        breadcrumbs={[{ label: i18n._(msg`درباره ما`) }]}
      />

      <section className="container mt-[70px]">
        <div className="mx-auto flex w-full max-w-[740px] flex-col items-center gap-5">
          <h2 className="border-b-2 border-primary pb-1 text-center text-[18px] font-bold text-[#000000] xl:text-[20px]">
            {data.about_text_title}
          </h2>

          <div
            className="w-full text-center text-[16px] text-[#353535]"
            dangerouslySetInnerHTML={{
              __html: data.about_text,
            }}
          />
        </div>
      </section>

      {data.achievements.length > 0 && (
        <section className="container mt-[122px]">
          <h3 className="mx-auto w-fit border-b-2 border-primary pb-1 text-center text-xl font-bold text-[#000000]">
            <Trans>افتخارات و دستاورد های کارخانه</Trans>
          </h3>

          <div className="mt-12">
            <AchievementsSlider data={data.achievements} />
          </div>
        </section>
      )}

      <section className="container mt-[114px] flex flex-col items-center gap-5 xl:flex-row">
        {data.manager_image && (
          <div className="w-full shrink-0 rounded-[5px] bg-[#F0DEC6] p-[8px] xl:max-w-[355px]">
            <Image
              src={data.manager_image}
              alt={data.manager_text_title || "مدیرعامل"}
              width={500}
              height={500}
              className="block h-auto w-full rounded-[2px]"
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="w-fit border-b-2 border-primary text-xl font-bold text-[#010101]">
            {data.manager_text_title}
          </h2>

          <div
            className="text-sm text-[#383838]"
            dangerouslySetInnerHTML={{
              __html: data.manager_text,
            }}
          />
        </div>
      </section>

      {albumImages.length > 0 && (
        <section className="container mt-[114px]">
          <div className="flex flex-col items-center gap-2">
            <h2 className="w-fit border-b-2 border-primary pb-1 text-center text-[20px] font-bold text-black">
              <Trans>آلبوم تصاویر</Trans>
            </h2>

            <p className="text-center text-[14px] text-[#7D7D7D]">
              <Trans>باستان از لنز دوربین</Trans>
            </p>
          </div>

          <div className="mt-12">
            <PhotoAlbum images={albumImages} />
          </div>
        </section>
      )}
    </main>
  );
}