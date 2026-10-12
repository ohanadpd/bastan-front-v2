"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useLingui } from "@lingui/react/macro";

export type AlbumImage = {
  id: string;
  src: string;
  alt: string;
  tall?: boolean;
  videoUrl?: string;
};

export default function PhotoAlbum({
  images,
}: {
  images: AlbumImage[];
}) {
  const { t } = useLingui();
  const [activeVideo, setActiveVideo] = useState<AlbumImage | null>(
    null,
  );

  return (
    <Dialog.Root
      open={activeVideo !== null}
      onOpenChange={(open) => {
        if (!open) setActiveVideo(null);
      }}
    >
      <div className="grid grid-flow-dense auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-3 xl:auto-rows-[200px]">
        {images.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-[10px] ${
              item.tall ? "row-span-2" : ""
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />

            {item.videoUrl && (
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label={t`پخش ویدئو`}
                  onClick={() => setActiveVideo(item)}
                  className="
                    absolute inset-0 flex items-center justify-center
                    bg-black/30 transition-colors hover:bg-black/40
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-[-4px]
                    focus-visible:outline-white
                  "
                >
                  <span className="flex size-[42px] items-center justify-center rounded-full bg-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 11.9997V9.32968C6 6.01968 8.35 4.65968 11.22 6.31968L13.53 7.65968L15.84 8.99968C18.71 10.6597 18.71 13.3697 15.84 15.0297L13.53 16.3697L11.22 17.7097C8.35 19.3397 6 17.9897 6 14.6697V11.9997Z"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </Dialog.Trigger>
            )}
          </div>
        ))}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/65 backdrop-blur-md" />

        <Dialog.Content
          aria-describedby={undefined}
          className="
            fixed inset-x-0 top-[8dvh] z-[1001]
            mx-auto max-h-[84dvh] w-[calc(100%_-_2rem)]
            max-w-[1000px] overflow-y-auto rounded-[10px]
            bg-[#141414] shadow-2xl focus:outline-none
          "
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white">
            <Dialog.Title className="text-sm font-medium sm:text-base">
              {activeVideo?.alt || t`ویدئوی باستان`}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t`بستن ویدئو`}
                className="
                  flex size-10 shrink-0 items-center justify-center
                  rounded-full bg-white/10 transition-colors
                  hover:bg-white/20
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-white
                "
              >
                <X size={20} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {activeVideo?.videoUrl && (
            <video
              key={activeVideo.id}
              src={activeVideo.videoUrl}
              poster={activeVideo.src}
              controls
              autoPlay
              playsInline
              aria-label={activeVideo.alt || t`ویدئوی باستان`}
              className="block max-h-[65dvh] w-full bg-black object-contain"
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}