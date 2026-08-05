import { initLingui } from "@/initLingui";
import { fetchHomePage } from "@/lib/services/home.services";
import { fetchTermsPage } from "@/lib/services/terms.services";
import HomeStyle1 from "@/components/home/pages/home-style-1";
import { TermsPageData } from "@/types/terms.types";
import { HomePageData } from "@/types/home.types";
import HomeStyle2 from "@/components/home/pages/home-style-2";
import HomeStyle3 from "@/components/home/pages/home-style-3";

export async function generateMetadata() {
  const { data } = (await fetchHomePage())
  return {
      title: data.page_title || data.title,
      description: data.page_description,
      keywords: data.page_keywords,
      openGraph: {
          title: data.title,
          description: data.page_description,
      },
  }
}

interface PagePropsData extends HomePageData {
  faq: TermsPageData[];
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang
  initLingui(lang)

  const { data: homeData } = await fetchHomePage()
  const { data: termsData } = await fetchTermsPage()
  
  const data = {
    ...homeData,
    ...termsData
  }

  return (
    data.theme === "1" ? <HomeStyle1 data={data} /> : data.theme === "2" ? <HomeStyle2 data={data} /> : <HomeStyle3 data={data} />
  );
}
