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
    <footer
      className="
                relative
                overflow-hidden
                bg-white
                pt-[51px]
            "
    >
      {/* Footer Background */}
      <div
        className="
                    absolute
                    inset-0
                    bg-no-repeat
                    bg-bottom
                    bg-contain
                    pointer-events-none
                "
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.78)), url('/images/footer/footer-bg.png')",
        }}
      />

      <div
        className="
                    relative
                    z-10
                    flex
                    flex-col
                    container
                "
      >
        {(settings.logo_footer || settings.logo) && (
          <div
            className="
                            relative
                            h-[72px]
                        "
          >
            <Image
              src={getMediaUrl(
                settings.logo_footer ? settings.logo_footer : settings.logo,
              )}
              alt="logo"
              fill
              className="
                                object-contain
                            "
            />
          </div>
        )}

        <p
          className="
                        text-center
                        max-w-[587px]
                        text-[#252525]
                        mx-auto
                        mt-10
                        text-sm
                    "
        >
          {settings.text}
        </p>

        <FooterNewsletter />

        <div
          className="
                        flex
                        flex-col
                        xl:flex-row
                        gap-4
                        flex-wrap
                        items-start
                        justify-center
                        mt-12
                    "
        >
          {groupedLinksArray.map((item, index) => (
            <div
              key={index}
              className="
                                    flex
                                    flex-col
                                    gap-4
                                    w-full
                                    xl:max-w-[268px]
                                "
            >
              <h3
                className="
                                        text-[#252525]
                                        font-bold
                                        text-sm
                                        pb-4
                                        border-b-[0.6px]
                                        border-[#252525]/20
                                    "
              >
                {item.category}
              </h3>

              <div
                className="
                                        flex
                                        flex-col
                                        gap-5
                                        text-sm
                                        text-[#252525]
                                    "
              >
                {item.items.map((link) => (
                  <Link
                    key={link.id}
                    href={link.link}
                    className="
                                                    hover:text-primary
                                                    transition-all
                                                "
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}

          <div
            className="
                            flex
                            flex-col
                            gap-4
                            w-full
                            xl:max-w-[268px]
                        "
          >
            <h3
              className="
                                text-[#252525]
                                font-bold
                                text-sm
                                pb-4
                                border-b-[0.6px]
                                border-[#252525]/20
                            "
            >
              <Trans>ارتباط با ما</Trans>
            </h3>

            <div
              className="
                                flex
                                flex-col
                                gap-5
                                text-sm
                                text-[#252525]
                            "
            >
              <div
                className="
                                    flex
                                    items-center
                                    justify-between
                                "
              >
                <h4>
                  <Trans>تلفن تماس</Trans>:
                </h4>

                <p dir="ltr">{settings.phone}</p>
              </div>

              <div
                className="
                                    flex
                                    items-center
                                    justify-between
                                "
              >
                <h4>
                  <Trans>ایمیل</Trans>:
                </h4>

                <p>{settings.email}</p>
              </div>

              <div
                className="
                                    flex
                                    justify-between
                                    gap-10
                                "
              >
                <h4>
                  <Trans>آدرس</Trans>:
                </h4>

                <p className="text-end">{settings.adresses}</p>
              </div>

              <div
                className="
                                    flex
                                    items-center
                                    gap-4
                                    mt-1
                                "
              >
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
                          <div
                            className="
                                                    relative
                                                    w-8
                                                    h-8
                                                "
                          >
                            <Image
                              src={getMediaUrl(social.dark_icon)}
                              alt={social.name}
                              fill
                              className="
                                                        object-contain
                                                    "
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

      <div
        className="
                    relative
                    z-10
                    group
                    mt-7
                    mb-6
                    mx-auto
                    container
                    bg-white
                    rounded-[500px]
                    h-14
                    text-sm
                    text-[#777]
                    flex
                    items-center
                    justify-center
                "
      >
        <a
          href="https://ohanaa.ir/"
          target="_blank"
          className="
                        h-full
                        flex
                        justify-center
                        items-center
                        gap-3
                    "
        >
          <p>
            <Trans>
              طراحی و توسعه توسط
              <span
                className="
                                    group-hover:text-[#B800DB]
                                    transition-all
                                "
              >
                استودیو اوهانا
              </span>
            </Trans>
          </p>

          <OhanaLogo width={12} height={25} className="w-auto h-auto" />
        </a>
      </div>
    </footer>
  );
}