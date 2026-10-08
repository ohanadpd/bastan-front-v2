"use client";

import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import Link from "@/components/localized-link";


import "swiper/css";
import "swiper/css/pagination";
import FactoryProjectCard, { FactoryProjectData } from "../factory-project-card";

const projects: FactoryProjectData[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `project-${index + 1}`,
    status: "در حال تامین سرمایه",
    title: "کاشی کف آرتو ۶۰×۶۰",
    area: "۵۰۰۰ متر مربع",
    progress: 50,
    amount: "۵۰۰,۰۰۰",
    profit: "۲۹.۵ ٪",
    deadline: "۴ ماه",
  }),
);

interface FactoryProjectsSectionProps {
  data?: FactoryProjectData[];
  moreHref?: string;
}

export default function FactoryProjectsSection({
  data = projects,
  moreHref = "/about-us",
}: FactoryProjectsSectionProps) {
  const id = useId();
  const paginationClass = `factory-pagination-${id.replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  )}`;

  if (!data.length) return null;

  return (
    <section className="container mt-[110px]">
      <div className="flex flex-col items-center text-center">
        <div className="w-fit">
          <h2 className="text-[17px] font-bold leading-[28px] text-[#252525] lg:text-[20px]">
            مشارکت در تولید
          </h2>

          <div className="mt-[6px] h-[2px] w-full bg-primary" />
        </div>

        <p className="mt-2 text-[14px] text-[#666666]">
          محصولات تولید شده در شرکت کاشی و سرامیک باستان
        </p>

        <Link
          href={moreHref}
          className="mt-5 flex h-[32px] items-center justify-center rounded-[5px] border border-primary px-4 text-[12px] text-primary transition-colors hover:bg-primary hover:text-white"
        >
          اطلاعات بیشتر
        </Link>
      </div>

      <div className="mt-10">
        <Swiper
          dir="rtl"
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={16}
          watchOverflow
          pagination={{
            el: `.${paginationClass}`,
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
        >
          {data.map((project) => (
            <SwiperSlide key={project.id}>
              <FactoryProjectCard data={project} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className={`${paginationClass} mt-6 flex min-h-3 items-center justify-center gap-1`}
        />
      </div>

      <style jsx global>{`
        .${paginationClass} .swiper-pagination-bullet {
          width: 4px;
          height: 4px;
          margin: 0 !important;
          border-radius: 999px;
          background: #d8d8d8;
          opacity: 1;
          transition: width 0.2s;
        }

        .${paginationClass} .swiper-pagination-bullet-active {
          width: 24px;
          background: var(--factory-pagination-color, #d71920);
        }
      `}</style>
    </section>
  );
}