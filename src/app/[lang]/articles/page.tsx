import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";
import * as React from "react";

import { NewCard } from "@/components/news/new-card";
import BlogsPostSlider from "../../../components/news/post-slider";

import {
  fetchArticleCategories,
  fetchArticleList,
  fetchArticlePageDetails,
} from "@/lib/services/articles.services";

import Link from "@/components/localized-link";
import { fetchSettingsData } from "@/lib/services/settigns.services";
import { cn } from "@/lib/utils";

import {
  ArticleCatergoriesList,
  ArticleList,
} from "@/types/articles.types";

import ArticlesHero from "@/components/articles/hero-theme";


export async function generateMetadata() {
  const { data } = await fetchArticlePageDetails();

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
}


export default async function ArticlesPage({
  params,
}: PageProps) {

  const { lang } = await params;

  initLingui(lang);


  const { data: categories } =
    await fetchArticleCategories();


  const { data: latestArticles } =
    await fetchArticleList(1, 3);


  const { data: settings } =
    await fetchSettingsData();


  const { data: pageDetails } =
    await fetchArticlePageDetails();



  let groupedArticles: {
    category: ArticleCatergoriesList;
    articles: ArticleList[];
  }[] = [];



  for (const ctg of categories.results) {

    const { data: latestCategoryArticles } =
      await fetchArticleList(
        1,
        12,
        String(ctg.pk),
      );


    groupedArticles = [
      ...groupedArticles,
      {
        category: ctg,
        articles: latestCategoryArticles.results,
      },
    ];

  }



  return (

    <main className="pb-[155px]">



      <ArticlesHero />



      <section className="container mt-14">

        <h2 className="text-xl font-bold text-[#252525]">

          <Trans>
            جدید ترین مقالات
          </Trans>

        </h2>


        <p className="text-sm text-[#626262] mt-2">

          <Trans>
            در {settings.name} چه اتفاقی می افتد؟
          </Trans>

        </p>



        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-12 max-h-fit">


          <div
            className={cn(
              "h-full grid gap-[25px]",
              latestArticles.results.length > 1
                ? "min-h-[515px] grid-rows-2"
                : "min-h-[245px]",
            )}
          >

            {latestArticles?.results
              .slice(0, 2)
              .reverse()
              .map((item, index) => (

                <Link
                  key={index}
                  href={`/articles/${item.pk}/${item.slug}`}
                  className="block"
                >

                  <NewCard
                    title={item.name}
                    description={item.description}
                    image={item.image}
                    className="w-full h-full"
                  />

                </Link>

              ))}

          </div>



          {latestArticles?.results[2] && (

            <Link
              href={`/articles/${latestArticles.results[2].pk}/${latestArticles.results[2].slug}`}
              className="block"
            >

              <NewCard
                title={latestArticles.results[2].name}
                description={latestArticles.results[2].description}
                image={latestArticles.results[2].image}
                className="w-full h-full"
              />

            </Link>

          )}


        </div>


      </section>





      {groupedArticles.map(

        (item) =>

          item.articles.length > 0 && (

            <section
              key={item.category.pk}
              className="container mt-[88px]"
            >

              <h2 className="text-xl font-bold text-[#252525]">

                {item.category.name}

              </h2>



              <div
                className="text-sm text-[#626262] mt-2"
                dangerouslySetInnerHTML={{
                  __html: item.category.description,
                }}
              />



              <div className="mt-12">

                <BlogsPostSlider
                  data={item.articles}
                  type="articles"
                />

              </div>


            </section>

          )

      )}



    </main>

  );
}