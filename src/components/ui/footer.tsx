import * as React from "react";
import Image from "next/image";
import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";

import OhanaLogo from "./ohana-logo";
import { SettingsPageData, LinkItem } from "@/types/settings.types";
import { getMediaUrl } from "@/lib/utils";
import FooterNewsletter from "./newsletter";

export default function Footer({ settings }: { settings: SettingsPageData }) {
  const { i18n } = useLingui();

  const groupedLinksArray = React.useMemo(() => {
    const groupedLinks = settings.links.reduce(
      (groups, item) => {
        const catTitle = item.category.title;

        if (!groups[catTitle]) {
          groups[catTitle] = [];
        }

        groups[catTitle].push(item);

        return groups;
      },
      {} as Record<string, LinkItem[]>,
    );

    return Object.entries(groupedLinks).map(([category, items]) => ({
      category,
      items,
    }));
  }, [settings.links]);

  return (
    <footer className="relative overflow-hidden bg-white pt-[51px]">
      {/* Footer Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-contain bg-bottom bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.78)), url('/images/footer/footer-bg.png')",
        }}
      />

      <div className="container relative z-10 flex flex-col">
        {(settings.logo_footer || settings.logo) && (
          <div className="relative h-[72px]">
            <Image
              src={getMediaUrl(
                settings.logo_footer ? settings.logo_footer : settings.logo,
              )}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        )}

        <p className="mx-auto mt-10 max-w-[587px] text-center text-sm text-[#252525]">
          {settings.text}
        </p>

        <FooterNewsletter />

        <div className="mt-12 flex flex-col flex-wrap items-start justify-center gap-4 xl:flex-row">
          {groupedLinksArray.map((item, index) => (
            <div
              key={index}
              className="flex w-full flex-col gap-4 xl:max-w-[268px]"
            >
              <h3 className="border-b-[0.6px] border-[#252525]/20 pb-4 text-sm font-bold text-[#252525]">
                {item.category}
              </h3>

              <div className="flex flex-col gap-5 text-sm text-[#252525]">
                {item.items.map((link) => (
                  <Link
                    key={link.id}
                    href={link.link}
                    className="transition-all hover:text-primary"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="flex w-full flex-col gap-4 xl:max-w-[268px]">
            <h3 className="border-b-[0.6px] border-[#252525]/20 pb-4 text-sm font-bold text-[#252525]">
              <Trans>ارتباط با ما</Trans>
            </h3>

            <div className="flex flex-col gap-5 text-sm text-[#252525]">
              <div className="flex items-center justify-between">
                <h4>
                  <Trans>تلفن تماس</Trans>:
                </h4>

                <p dir="ltr">{settings.phone}</p>
              </div>

              <div className="flex items-center justify-between">
                <h4>
                  <Trans>ایمیل</Trans>:
                </h4>

                <p>{settings.email}</p>
              </div>

              <div className="flex justify-between gap-10">
                <h4>
                  <Trans>آدرس</Trans>:
                </h4>

                <p className="text-end">{settings.adresses}</p>
              </div>

              <div className="mt-1 flex items-center gap-4">
                {settings.socials
                  .filter(
                    (item) =>
                      item.display_section === "both" ||
                      item.display_section === "footer",
                  )
                  .map(
                    (social, index) =>
                      social.dark_icon &&
                      social.link && (
                        <Link key={index} href={social.link}>
                          <div className="relative h-8 w-8">
                            <Image
                              src={getMediaUrl(social.dark_icon)}
                              alt={social.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </Link>
                      ),
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ohana */}
      <div className="container relative z-10 mx-auto mb-6 mt-7 flex h-14 items-center justify-center gap-3 rounded-[500px] bg-white text-sm text-[#777]">
        <p>
          <Trans>
            طراحی و توسعه توسط استودیو{" "}
            <Link
              href="https://ohanaa.ir/"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-[#777] underline underline-offset-4 hover:!text-[#777]"
            >
              اوهانا
            </Link>
          </Trans>
        </p>

        <OhanaLogo width={12} height={25} className="h-auto w-auto" />
      </div>
    </footer>
  );
}
