import ProductCard from "@/components/ui/product-card";
import ProductsFilter from "@/components/products/filter";
import ProductsMobileFilter from "@/components/products/mobile-filter";
import Pagination from "@/components/ui/pagination";
import PageHero from "@/components/shared/page-hero";
import LocalizedLink from "@/components/localized-link";
import KashefSearch from "@/components/products/kashef-search";
import { msg } from "@lingui/core/macro";
import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";

import {
  fetchProductList,
  fetchProductPageDetails,
} from "@/lib/services/products.services";

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

  const i18n = initLingui(lang);

  const { data: pageDetails } = await fetchProductPageDetails();

  const { category, brand, attr, minprice, maxprice, page } =
    await searchParams;

  const limit = 12;
  const parsedPage = Number(page ?? "1");
  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { data } = await fetchProductList({
    page: currentPage,
    limit,
    category,
    brand,
    attribute_value: attr,
    price_max: maxprice,
    price_min: minprice,
  });

  const totalPages = Math.ceil(data.count / limit);

  return (
    <main className="pb-[104px]">
      <PageHero
        bannerImage={pageDetails.banner_image}
        mobileBannerImage={pageDetails.banner_image_mobile}
        tabletBannerImage={pageDetails.banner_image_tablet}
        breadcrumbs={[{ label: i18n._(msg`محصولات`) }]}
      />

      <section className="container pt-14">
        <div className="mt-[54px] flex gap-5">
          <div className="hidden w-[265px] shrink-0 xl:block">
            <ProductsFilter />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <KashefSearch />
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.results.map((item) => (
                <LocalizedLink
                  key={item.id}
                  href={`/products/${item.id}/${item.slug}`}
                >
                  <ProductCard
                    title={item.name}
                    description={item.description}
                    badges={item.badge}
                    image={item.image}
                  />
                </LocalizedLink>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex w-full justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
