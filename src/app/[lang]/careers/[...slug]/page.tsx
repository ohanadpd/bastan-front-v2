import { Trans } from "@lingui/react/macro";
import * as React from "react";
import { initLingui } from "@/initLingui";
import CareersResumeForm from "@/components/careers/resume-form";
import ScrollToFormButton from "@/components/careers/scroll-to-form-button";
import {
  fetchEmploymentDetails,
  fetchEmploymentPageDetails,
  fetchPositions,
} from "@/lib/services/employment.services";
import { getMediaUrl } from "@/lib/utils";
import Link from "@/components/localized-link";
import PageHero from "@/components/shared/page-hero";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data } = await fetchEmploymentDetails(slug[0]);
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
    slug: string[];
  }>;
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;

  const { data } = await fetchEmploymentDetails(slug[0]);
  const { data: pageDetails } = await fetchEmploymentPageDetails();
  const { data: positions } = await fetchPositions();
  const i18n = initLingui(lang);
  return (
    <main className="pb-[123px]">
      <section className="container pt-[130px] xl:pt-[150px]">
        <nav
          aria-label="Breadcrumb"
          className="flex justify-center xl:justify-start"
        >
          <ol className="inline-flex flex-wrap items-center justify-center gap-1 rounded-[50px] bg-white px-[18px] py-[10px] text-[12px] text-[#575656]">
            <li>
              <Link href="/">
                <Trans>خانه</Trans>
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link href="/careers">
                <Trans>فرصت‌های شغلی</Trans>
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li aria-current="page" className="text-primary">
              {data.job_title}
            </li>
          </ol>
        </nav>
      </section>
      <section className="container mt-[60px]">
        <h2 className="mx-auto w-fit border-b-2 border-primary pb-2 text-center text-2xl font-extrabold">
          {data.job_title}
        </h2>
        <div className="mt-[58px] rounded-[5px] border-[0.6px] border-[#F2F2F2] bg-white px-5 py-7">
          <h3 className="text-lg font-bold text-[#3B3B3B]">
            <Trans>درباره این موقعیت شغلی</Trans>
          </h3>
          <div className="flex flex-col gap-2 mt-[26px] text-[#424141]">
            <div dangerouslySetInnerHTML={{ __html: data.description }} />
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
          <ScrollToFormButton
            className="
                        mt-6 inline-flex h-[40px] w-[166px] !min-w-0
                        items-center justify-center rounded-[5px]
                        !border-[1px] !border-primary !bg-white
                        text-[14px] font-normal !text-primary !shadow-none
                        hover:!bg-primary hover:!text-white
                        active:!bg-primary active:!text-white
                    "
          >
            <Trans>ارسال رزومه</Trans>
          </ScrollToFormButton>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
          <div className="rounded-[5px] border-[0.6px] border-[#F2F2F2] bg-white px-5 py-7">
            <h3 className="text-lg font-bold text-[#3B3B3B]">
              <Trans>مهارت های مورد نیاز و مسیولیتها</Trans>
            </h3>
            <div
              className="mt-[26px] text-[#424141]"
              dangerouslySetInnerHTML={{ __html: data.required_skills }}
            />
          </div>
          <div className="rounded-[5px] border-[0.6px] border-[#F2F2F2] bg-white px-5 py-7">
            <h3 className="text-lg font-bold text-[#3B3B3B]">
              <Trans>مزایای کار در این شرکت</Trans>
            </h3>
            <div
              className="mt-[26px] text-[#424141]"
              dangerouslySetInnerHTML={{ __html: data.required_skills }}
            />
          </div>
        </div>
      </section>
      <section id="resume-form" className="mt-[98px]">
        <h3 className="text-center font-bold text-xl">
          <Trans>ارسال رزومه</Trans>
        </h3>
        <div className="mt-10">
          <CareersResumeForm positions={positions.results} />
        </div>
      </section>
    </main>
  );
}
