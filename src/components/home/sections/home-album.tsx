"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/localized-link";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { Play, X } from "lucide-react";

type AlbumItem =
  | {
      id: string;
      type: "image";
      src: string;
      title: string;
    }
  | {
      id: string;
      type: "video";
      thumbnail: string;
      aparatId: string;
      title: string;
    };

const albumItems: AlbumItem[] = [
  {
    id: "image-1",
    type: "image",
    src: "/images/allbum.jpg",
    title: "تصاویر باستان",
  },
  {
    id: "video-1",
    type: "video",
    thumbnail: "/images/allbum.jpg",
    aparatId: "3RchT",
    title: "ویدئوی باستان",
  },
  ...Array.from(
    { length: 8 },
    (_, index): AlbumItem => ({
      id: `image-${index + 2}`,
      type: "image",
      src: "/images/allbum.jpg",
      title: "تصاویر باستان",
    }),
  ),
];

const visibleItems = albumItems.slice(0, 6);

export default function HomeAlbum() {
  const [selectedId, setSelectedId] = useState(visibleItems[0].id);

  const [activeVideo, setActiveVideo] = useState<Extract<
    AlbumItem,
    { type: "video" }
  > | null>(null);

  const reduceMotion = useReducedMotion();

  const selectedItem =
    visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0];

  const selectedImage =
    selectedItem.type === "image" ? selectedItem.src : selectedItem.thumbnail;

  function selectItem(item: AlbumItem) {
    setSelectedId(item.id);

    if (item.type === "video") {
      setActiveVideo(item);
    }
  }

  return (
    <Dialog.Root
      open={activeVideo !== null}
      onOpenChange={(open) => {
        if (!open) setActiveVideo(null);
      }}
    >
      <section className="container mt-[110px]">
        <div className="mx-auto w-full max-w-[1000px]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-fit">
              <h2 className="text-center text-[17px] font-bold leading-[28px] text-[#252525] lg:text-[20px]">
                آلبوم تصاویر
              </h2>

              <div className="mt-[6px] h-[2px] w-full bg-primary" />
            </div>

            <p className="mt-2 text-[14px] text-[#666666]">
              باستان از لنز دوربین
            </p>
          </div>

          <div className="relative aspect-[1.45/1] overflow-hidden rounded-[10px] bg-white sm:aspect-[2.3/1]">
            <Image
              src={selectedImage}
              alt={selectedItem.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover"
            />

            {selectedItem.type === "video" && (
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label={`پخش ${selectedItem.title}`}
                  onClick={() => setActiveVideo(selectedItem)}
                  className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform hover:scale-110 sm:h-16 sm:w-16">
                    <Play
                      className="h-6 w-6 text-primary sm:h-7 sm:w-7"
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </Dialog.Trigger>
            )}
          </div>

          <div
            dir="rtl"
            className="mt-2 flex items-center gap-2 rounded-[10px] border border-[#E0E0E0] bg-white p-2 sm:mt-4 sm:gap-4 sm:p-3"
          >
            <div
              className="grid min-w-0 flex-1 grid-cols-3 gap-1 sm:grid-cols-6 sm:gap-4"
              aria-label="عکس‌ها و ویدئوهای آلبوم"
            >
              {visibleItems.map((item, index) => {
                const isActive = selectedId === item.id;

                const thumbnail =
                  item.type === "image" ? item.src : item.thumbnail;

                const thumbnailButton = (
                  <button
                    type="button"
                    aria-label={
                      item.type === "video"
                        ? `پخش ${item.title}`
                        : `نمایش ${item.title}`
                    }
                    aria-pressed={isActive}
                    onClick={() => selectItem(item)}
                    className={`relative aspect-square w-full min-w-0 overflow-hidden rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      index >= 3 ? "hidden sm:block" : ""
                    }`}
                  >
                    <Image
                      src={thumbnail}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 25vw, 140px"
                      className="object-cover"
                    />

                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                        isActive ? "opacity-0" : "opacity-100"
                      }`}
                    />

                    {item.type === "video" && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 sm:h-9 sm:w-9">
                          <Play
                            className="h-3 w-3 text-primary sm:h-4 sm:w-4"
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                    )}
                  </button>
                );

                return item.type === "video" ? (
                  <Dialog.Trigger key={item.id} asChild>
                    {thumbnailButton}
                  </Dialog.Trigger>
                ) : (
                  <span key={item.id} className="contents">
                    {thumbnailButton}
                  </span>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center justify-center sm:px-2">
              <Link
                href="/about-us"
                className="flex h-[32px] items-center justify-center whitespace-nowrap rounded-[5px] border border-primary px-2 text-[11px] text-primary transition-colors hover:bg-primary hover:text-white sm:px-4 sm:text-sm"
              >
                بیشتر بدانید
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[1000] bg-black/65 backdrop-blur-md"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild aria-describedby={undefined}>
          <motion.div
            initial={{
              y: reduceMotion ? 0 : "-100vh",
              opacity: 0,
            }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-x-0 top-[8dvh] z-[1001] mx-auto max-h-[84dvh] w-[calc(100%_-_2rem)] max-w-[1000px] overflow-y-auto rounded-[10px] bg-[#141414] shadow-2xl focus:outline-none"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 text-white">
              <Dialog.Title className="text-sm font-medium sm:text-base">
                {activeVideo?.title}
              </Dialog.Title>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="بستن ویدئو"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="relative aspect-video bg-black">
              {activeVideo && (
                <iframe
                  key={activeVideo.id}
                  src={`https://www.aparat.com/video/video/embed/videohash/${activeVideo.aparatId}/vt/frame`}
                  title={activeVideo.title}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}