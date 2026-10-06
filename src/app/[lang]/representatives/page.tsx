import * as React from "react";
import { Trans } from "@lingui/react/macro";
import { initLingui } from "@/initLingui";

import AgenciesMapWrapper from "@/components/representatives/map-wrapper";

import {
  fetchRepresentationList,
  fetchRepresentationPageDetails,
} from "@/lib/services/representation.services";

import AgenciesHero from "@/components/representatives/hero";


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

  initLingui(lang);


  const {
    representative,
    province,
    city,
  } = await searchParams;



  const { data } =
    await fetchRepresentationList(
      representative || undefined,
      Number(city) || undefined,
      Number(province) || undefined
    );

  const { data: pageDetails } =
    await fetchRepresentationPageDetails();

  return (

    <main className="pb-[118px]">



      <AgenciesHero
        bannerImage={pageDetails.banner_image}
        mobileBannerImage={pageDetails.banner_image_mobile}
      />



      <AgenciesMapWrapper
        className="mt-9"
        initialData={data.results}
      />


    </main>

  );
}