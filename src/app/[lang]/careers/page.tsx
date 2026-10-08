import { Trans } from "@lingui/react/macro";
import * as React from "react";
import { initLingui } from "@/initLingui";
import { Flag2 } from "iconsax-reactjs";

import {
  fetchEmploymentList,
  fetchEmploymentPageDetails,
} from "@/lib/services/employment.services";

import Link from "@/components/localized-link";
import Pagination from "@/components/ui/pagination";
import CareersHero from "@/components/careers/hero";


export async function generateMetadata() {
  const { data } = await fetchEmploymentPageDetails();

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


export default async function CareersPage({
  params,
  searchParams,
}: PageProps) {

  const { lang } = await params;

  initLingui(lang);


  const page = Number((await searchParams).page) || 1;

  const limit = 1;


  const { data } = await fetchEmploymentList(page, limit);

  const { data: pageDetails } =
    await fetchEmploymentPageDetails();


  const totalPages = Math.ceil(
    data ? data.count / limit : 0
  );


  return (
    <main className="pb-[123px]">



      <CareersHero
        bannerImage={pageDetails.banner_image}
        mobileBannerImage={pageDetails.banner_image_mobile}
        tabletBannerImage={pageDetails.banner_image_tablet}
      />



      <section className="container mt-[68px]">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-x-5 xl:gap-y-6">


          {data.results.map((item, index) => (

            <Link
              href={`/careers/${item.id}/${item.slug}`}
              key={index}
              className="group bg-white rounded-[5px] py-8 px-5 border-[0.6px] border-[#E5E4E4] hover:border-primary transition-all duration-300"
            >

              <h3 className="text-lg font-bold group-hover:text-primary transition-all duration-300">

                {item.job_title}

              </h3>



              <ul className="space-y-4 mt-6 text-lg text-[#424141]">

                <li className="flex items-center gap-2">

                  <Flag2 size={20} color="#949494" />

                  {item.city}

                </li>



                {item.tag.map((tag, index) => (

                  <li
                    key={index}
                    className="flex items-center gap-2"
                  >

                    <Flag2 size={20} color="#949494" />

                    {tag}

                  </li>

                ))}


              </ul>


            </Link>

          ))}


        </div>



        <div className="flex justify-center mt-4 w-full">

          <Pagination
            currentPage={page}
            totalPages={totalPages}
          />

        </div>


      </section>


    </main>
  );
}