import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";
import * as React from "react";
import Image from "next/image";
import { ArrowLeft2, Import } from "iconsax-reactjs";
import {
  fetchCatalogsList,
  fetchCatalogsPageDetails,
} from "@/lib/services/catalogs.services";
import { notFound } from "next/navigation";
import Link from "@/components/localized-link";
import { cn } from "@/lib/utils";
import Pagination from "@/components/ui/pagination";
import PageHero from "@/components/shared/page-hero";
import { msg } from "@lingui/core/macro";

export async function generateMetadata() {
  const { data } = await fetchCatalogsPageDetails();
  return {
    title: data.page_title || data.title,
    description: data.page_description,
    keywords: data.page_keywords,
    openGraph: {
      title: data.title,
      description: data.page_description,
    },
  };
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const i18n = initLingui(lang);

  // fetching data of page (banner, title and subtitle)
  const { data: pageDetails } = await fetchCatalogsPageDetails();

  const page = Number((await searchParams).page) || 1;
  const limit = 12;

  let data;
  try {
    const { data: catalogs } = await fetchCatalogsList(page, limit);
    data = catalogs;
  } catch (error: any) {
    return notFound();
  }

  const totalPages = Math.ceil(data ? data?.count / limit : 0);

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();

    // Manually iterate over searchParams and only add valid string values
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        params.set(key, value);
      }
    });

    params.set("page", newPage.toString());
    return `/catalog?${params.toString()}`;
  };

  return (
    <main className="pb-[123px]">
      <PageHero
        bannerImage={pageDetails.banner_image}
        mobileBannerImage={pageDetails.banner_image_mobile}
        tabletBannerImage={pageDetails.banner_image_tablet}
        breadcrumbs={[{ label: i18n._(msg`کاتالوگ`) }]}
      />

      <div className="container mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.results.map((item) => (
          <div
            key={item.id ?? item.download_url}
            className="group relative aspect-[320/350] overflow-hidden rounded-[5px] bg-[#F2F2F2]"
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-x-[5px] bottom-[7px] flex h-[52px] items-center justify-between gap-3 rounded-[5px] bg-white px-[10px]">
              <h3 className="min-w-0 truncate text-[14px] font-normal text-black">
                {item.name}
              </h3>

              <a
                href={item.download_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={i18n._(msg`دانلود کاتالوگ`)}
                className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-primary text-white  "
              >
                <Import size={24} color="#ffffff"  />
              </a>
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="col-span-full mt-4 flex w-full justify-center">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </main>
  );
}
