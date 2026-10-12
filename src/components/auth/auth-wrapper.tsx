"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  lang: string;
}

export default function AuthWrapper({
  children,
  lang,
}: AuthWrapperProps) {
  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer) return;

    const previousDisplay = footer.style.display;
    footer.style.display = "none";

    return () => {
      footer.style.display = previousDisplay;
    };
  }, []);

  return (
    <main className="container pb-12 pt-[130px] xl:pt-[150px]">
      <div
        className="
          relative isolate flex h-full
          items-center justify-center overflow-hidden
          rounded-[10px]
          xl:min-h-[600px] xl:justify-start
          xl:bg-primary xl:p-6
        "
      >
        <Image
          src={
            lang === "en"
              ? "/images/auth/auth-bg-en.jpg"
              : "/images/auth/auth-bg.jpg"
          }
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-10 hidden object-cover xl:block"
        />

        {children}
      </div>
    </main>
  );
}