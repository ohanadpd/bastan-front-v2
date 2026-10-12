import * as React from "react";
import { Trans } from "@lingui/react/macro";
import { initLingui } from "@/initLingui";

import AgenciesMapWrapper from "@/components/representatives/map-wrapper";
import { msg } from "@lingui/core/macro";
import {
  fetchRepresentationList,
  fetchRepresentationPageDetails,
} from "@/lib/services/representation.services";

import PageHero from "@/components/shared/page-hero";

export async function generateMetadata() {
  const { data } = await fetchRepresentationPageDetails();

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
    representative?: string;
    province?: string;
    city?: string;
  }>;
}

export default async function AgenciesPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;

  const i18n = initLingui(lang);

  const { representative, province, city } = await searchParams;

  const { data } = await fetchRepresentationList(
    representative || undefined,
    Number(city) || undefined,
    Number(province) || undefined,
  );

  const { data: pageDetails } = await fetchRepresentationPageDetails();

  return (
    <main className="pb-[118px]">
      <PageHero
        bannerImage={pageDetails.banner_image}
        mobileBannerImage={pageDetails.banner_image_mobile}
        tabletBannerImage={pageDetails.banner_image_tablet}
        breadcrumbs={[{ label: i18n._(msg`نمایندگی ها`) }]}
      />

      <AgenciesMapWrapper className="mt-9" initialData={data.results} />
    </main>
  );
}
