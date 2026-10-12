import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";
import * as React from "react";
import Image from "next/image";
import AchievementsSlider from "@/components/about-us/achievements-slider";
import { fetchAboutUsPage } from "@/lib/services/about-us.services";
import Link from "@/components/localized-link";
import PageHero from "@/components/shared/page-hero";
import PhotoAlbum, { AlbumImage } from "@/components/about-us/photo-album";
import { msg } from "@lingui/core/macro";

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


const albumImages: AlbumImage[] = [
  {
    id: "1",
    src: "/images/about-us/album/1.jpg",
    alt: "تصویر اول کارخانه باستان",
    tall: true,
  },
  {
    id: "2",
    src: "/images/about-us/album/2.jpg",
    alt: "تصویر دوم کارخانه باستان",
  },
  {
    id: "3",
    src: "/images/about-us/album/3.jpg",
    alt: "تصویر سوم کارخانه باستان",
    tall: true,
  },
  {
    id: "4",
    src: "/images/about-us/album/1.jpg",
    alt: "تصویر چهارم کارخانه باستان",
    
  },
  {
    id: "5",
    src: "/images/about-us/album/2.jpg",
    alt: "تصویر پنجم کارخانه باستان",
     videoUrl: "/videos/about-us/factory.mp4",
  },
  {
    id: "6",
    src: "/images/about-us/album/3.jpg",
    alt: "تصویر ششم کارخانه باستان",
    tall: true,
  },
  {
    id: "7",
    src: "/images/about-us/album/1.jpg",
    alt: "تصویر هفتم کارخانه باستان",
  },
  {
    id: "8",
    src: "/images/about-us/album/2.jpg",
    alt: "تصویر هشتم کارخانه باستان",
  },
  {
    id: "9",
    src: "/images/about-us/album/3.jpg",
    alt: "تصویر هشتم کارخانه باستان",
  },
  {
    id: "10",
    src: "/images/about-us/album/3.jpg",
    alt: "تصویر ششم کارخانه باستان",
    tall: true,
  },
  {
    id: "11",
    src: "/images/about-us/album/1.jpg",
    alt: "تصویر هفتم کارخانه باستان",
     videoUrl: "/videos/about-us/factory.mp4",
  },
  {
    id: "12",
    src: "/images/about-us/album/2.jpg",
    alt: "تصویر هشتم کارخانه باستان",
  },
  {
    id: "13",
    src: "/images/about-us/album/3.jpg",
    alt: "تصویر هشتم کارخانه باستان",
  },
  {
    id: "14",
    src: "/images/about-us/album/3.jpg",
    alt: "تصویر هشتم کارخانه باستان",
     videoUrl: "/videos/about-us/factory.mp4",
  },
];
export default async function AboutUsPage({ params }: PageProps) {
  const { data } = await fetchAboutUsPage();
  const { lang } = await params;

  const i18n = initLingui(lang);

  return (
    <main className="pb-[155px]">
      <PageHero
        bannerImage={data.banner_image}
        mobileBannerImage={data.banner_image_mobile}
        tabletBannerImage={data.banner_image_tablet}
        breadcrumbs={[
          { label: i18n._(msg`درباره ما`) },
        ]}
      />

      <section className="container mt-[70px]">
        <div className="mx-auto flex w-full max-w-[740px] flex-col items-center gap-5">
          <h2 className="border-b-2 border-primary pb-1 text-center text-[18px] font-bold text-[#000000] xl:text-[20px]">
            {data.about_text_title}
          </h2>

          <div
            className="w-full text-center text-[16px]  text-[#353535]"
            dangerouslySetInnerHTML={{
              __html: data.about_text,
            }}
          />
        </div>
      </section>

      {data.achievements.length > 0 && (
        <section className="container mt-[122px]">
          <h3 className="text-center w-fit mx-auto border-b-2 border-primary pb-1 text-xl font-bold text-[#000000]">
            <Trans>افتخارات و دستاورد های کارخانه</Trans>
          </h3>

          <div className="mt-12">
            <AchievementsSlider data={data.achievements} />
          </div>
        </section>
      )}

      <section className="container flex flex-col xl:flex-row items-center gap-5 mt-[114px]">
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
          <h2 className="text-xl font-bold text-[#010101] border-b-2 border-primary w-fit">
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
    </main>
  );
}
