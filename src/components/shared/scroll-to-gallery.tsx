"use client";

import { useLayoutEffect } from "react";

export default function ScrollToGallery() {
  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scroll") !== "gallery") return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const timer = window.setTimeout(() => {
      document.getElementById("gallery")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 600);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}