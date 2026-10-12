"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="grid grid-flow-dense auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-3 xl:auto-rows-[200px]">
      {images.map((item) => (
        <div
          key={item.id}
          className={`
            relative overflow-hidden rounded-[10px]
            ${item.tall ? "row-span-2" : ""}
          `}
        >
          {item.videoUrl && activeVideoId === item.id ? (
            <video
              src={item.videoUrl}
              poster={item.src}
              controls
              autoPlay
              playsInline
              aria-label={item.alt}
              className="h-full w-full bg-black object-contain"
            />
          ) : (
            <>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />

              {item.videoUrl && (
                <button
                  type="button"
                  aria-label={`پخش ویدئو: ${item.alt}`}
                  onClick={() => setActiveVideoId(item.id)}
                  className="
                    absolute inset-0 flex items-center justify-center
                    bg-black/30 transition-colors hover:bg-black/40
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:-outline-offset-4
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
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}