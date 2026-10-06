import ProductCard from "@/components/ui/product-card";
import ProductsFilter from "@/components/products/filter";
import * as React from "react";
import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";
import LocalizedLink from "@/components/localized-link";

import {
  fetchProductList,
  fetchProductPageDetails,
} from "@/lib/services/products.services";

import ProductsMobileFilter from "@/components/products/mobile-filter";
import Pagination from "@/components/ui/pagination";
import ProductsHeroTheme3 from "@/components/products/hero";
import ProductsHero from "@/components/products/hero";

export async function generateMetadata() {
  const { data } = await fetchProductPageDetails();

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
    category?: string[] | string;
    brand?: string[] | string;
    attr?: string[] | string;
    minprice?: string;
    maxprice?: string;
  }>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {

  const { lang } = await params;

  initLingui(lang);
  const { data: pageDetails } = await fetchProductPageDetails();


  const {
    category,
    brand,
    attr,
    minprice,
    maxprice,
    page,
  } = await searchParams;


  const limit = 12;

  const currentPage = parseInt(page ?? "1");



  const { data } = await fetchProductList({
    page: currentPage,
    limit,
    category,
    brand,
    attribute_value: attr,
    price_max: maxprice,
    price_min: minprice,
  });



  const totalPages = Math.ceil(
    data ? data.count / limit : 0
  );



  const createPageUrl = (newPage: number) => {

    const params = new URLSearchParams();


    Object.entries(searchParams).forEach(([key, value]) => {

      if (value && typeof value === "string") {
        params.set(key, value);
      }

    });


    params.set(
      "page",
      newPage.toString()
    );


    return `/products?${params.toString()}`;

  };



  return (

    <main className="pb-[104px]">



      <ProductsHero
      bannerImage={pageDetails.banner_image}
      mobileBannerImage={pageDetails.banner_image_mobile}
    />



      <section className="container pt-14">


        <div className="flex justify-between xl:justify-center items-center">


          <h2 className="text-[28px] font-bold text-[#252525] text-center">

            <Trans>
              محصولات
            </Trans>

          </h2>



          <ProductsMobileFilter />


        </div>




        <div className="flex gap-5 mt-[88px]">


          <div className="w-[265px] shrink-0 hidden xl:block">

            <ProductsFilter />

          </div>



          <div className="flex flex-col gap-10 w-full">


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">


              {data.results.map((item, index) => (

                <LocalizedLink
                  href={`/products/${item.id}/${item.slug}`}
                  key={index}
                >

                  <ProductCard
                    title={item.name}
                    description={item.description}
                    badges={item.badge}
                    image={item.image}
                  />

                </LocalizedLink>

              ))}



              <div className="flex justify-center mt-4 col-span-full w-full">

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />

              </div>



            </div>


          </div>


        </div>


      </section>


    </main>

  );
}