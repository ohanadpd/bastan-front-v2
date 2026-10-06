import { initLingui } from "@/initLingui";
import { fetchHomePage } from "@/lib/services/home.services";
import { fetchTermsPage } from "@/lib/services/terms.services";
import HomeStyle from "@/components/home/pages/home";
import { TermsPageData } from "@/types/terms.types";
import { HomePageData } from "@/types/home.types";

export async function generateMetadata() {
  const { data } = await fetchHomePage();

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

interface PagePropsData extends HomePageData {
  faq: TermsPageData[];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;
  initLingui(lang);

  const { data: homeData } = await fetchHomePage();
  const { data: termsData } = await fetchTermsPage();

  const data = {
    ...homeData,
    ...termsData,
  };

  return <HomeStyle data={data} />;
}