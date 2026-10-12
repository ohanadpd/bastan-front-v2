"use client";

import dynamic from "next/dynamic";
import { Trans } from "@lingui/react/macro";
import { cn } from "@/lib/utils";
import type { Representation } from "@/types/representation.types";

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 animate-spin rounded-full border-b-2 border-primary" />

        <p className="text-sm text-[#808080]">
          <Trans>در حال بارگذاری نقشه...</Trans>
        </p>
      </div>
    </div>
  );
}

const AgenciesMap = dynamic(
  () => import("../representatives/map"),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);

type ContactUsMapWrapperProps = {
  className?: string;
  longitude: string;
  latitude: string;
};

export default function ContactUsMapWrapper({
  className,
  longitude,
  latitude,
}: ContactUsMapWrapperProps) {
  const initialData = [
    {
      pk: 0,
      slug: "",
      province: { id: 0, name: "" },
      city: { id: 0, province: 0, name: "" },
      name: "",
      manager_first_name: "",
      image: "",
      address: "",
      phone_number: "",
      email: "",
      longitude: Number(longitude),
      latitude: Number(latitude),
    },
  ] as Representation[];

  return (
    <section className={cn("w-full", className)}>
      

      <div className="mx-auto w-full max-w-[740px] rounded-[10px] bg-[#F0DEC6] p-[12px] md:p-[18px]">
        <div className="relative isolate h-[300px] w-full overflow-hidden rounded-[5px] md:h-[385px]">
          <AgenciesMap
            initialData={initialData}
            selectedAgency={{
              center: [Number(longitude), Number(latitude)],
              zoom: 5,
            }}
          />
        </div>
      </div>
    </section>
  );
}