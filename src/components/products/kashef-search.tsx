"use client";

import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Trans } from "@lingui/react/macro";
import {
  CloseCircle,
  ExportCurve,
  Gallery,
  Link2,
  SearchNormal,
} from "iconsax-reactjs";

export default function KashefSearch() {
  const panelId = useId();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState<"image" | "link">("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(false);

  const selectFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError(true);
      return;
    }

    setFileError(false);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="w-full rounded-[10px] border border-[#E5E5E5] bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-4 p-4 text-start"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/logos/kashef.svg"
            alt="کاشف"
            width={36}
            height={36}
            className="shrink-0"
          />

          <span className="text-[16px] font-bold leading-6 text-[#353535] md:text-[14px]">
            <Trans>
              بگرد و کشف کن. با جست و جوی تصویری، محصول مورد نظرت رو پیدا کن.
            </Trans>
          </span>
        </span>

        <span
          aria-hidden="true"
          className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path
              d="M19.92 8.9502L13.4 15.4702C12.63 16.2402 11.37 16.2402 10.6 15.4702L4.07996 8.9502"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div id={panelId} hidden={!isOpen} className="px-4 pb-4">
        <div
                className="relative rounded-[5px] border border-[#EEEEEE] bg-[#FAFAFA] bg-repeat px-4 py-5 md:px-8"
                style={{
                    backgroundImage: "url('/images/patern-1.svg')",
                }}
                >
          <h3 className="text-center text-[18px] font-bold text-black">
            <Trans>بگرد و کشف کن</Trans>
          </h3>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              aria-pressed={searchType === "image"}
              onClick={() => setSearchType("image")}
              className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[14px]  ${
                searchType === "image"
                  ? "border-[#1298C6] bg-white text-[#1298C6]"
                  : "border-transparent bg-[#F2F2F2] text-[#595959]"
              }`}
            >
              <Gallery size={22} color="currentColor" />
              <Trans>جست و جو با تصویر</Trans>
            </button>

            <button
              type="button"
              aria-pressed={searchType === "link"}
              onClick={() => setSearchType("link")}
              className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[12px] md:text-[14px] ${
                searchType === "link"
                  ? "border-[#1298C6] bg-white text-[#1298C6]"
                  : "border-transparent bg-[#F2F2F2] text-[#595959]"
              }`}
            >
              <Link2 size={22} color="currentColor" />
              <Trans>جست و جو با لینک</Trans>
            </button>
          </div>

          {searchType === "image" ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mx-auto mt-4 flex min-h-[150px] w-full max-w-[550px] flex-col items-center justify-center rounded-[10px] border border-dashed bg-[#FCFDFE] p-4 ${
                isDragging ? "border-[#00A3D9]" : "border-[#B5B5B5]"
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="پیش‌نمایش تصویر انتخاب‌شده"
                    width={150}
                    height={150}
                    unoptimized
                    className="h-[150px] w-[150px] rounded-[8px] object-contain"
                  />

                  <button
                    type="button"
                    aria-label="حذف تصویر"
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -end-2 rounded-full bg-white p-1 text-primary shadow"
                  >
                    <CloseCircle size={24} color="currentColor" />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 block w-full text-center text-[12px] text-[#00A3D9]"
                  >
                    <Trans>تغییر تصویر</Trans>
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex size-[46px] items-center justify-center rounded-[8px] bg-white text-[#194B63] shadow-sm">
                    <ExportCurve size={32} color="currentColor" />
                  </span>

                  <p className="mt-4 text-[14px] font-bold text-black">
                    <Trans>تصویر را بکشید و رها کنید</Trans>
                  </p>

                  <p className="mt-2 text-[14px] text-[#5B5B5B]">
                    <Trans>یا فایل را از سیستم</Trans>{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#00A3D9] hover:underline"
                    >
                      <Trans>انتخاب کنید</Trans>
                    </button>
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {fileError && (
                <p role="alert" className="mt-3 text-[12px] text-primary">
                  <Trans>لطفاً یک فایل تصویر انتخاب کنید.</Trans>
                </p>
              )}
            </div>
          ) : (
            <div className="mx-auto mt-4 flex min-h-[150px] w-full max-w-[550px] flex-col justify-center gap-3">
              <label htmlFor={inputId} className="text-[13px] text-[#353535]">
                <Trans>لینک مستقیم تصویر</Trans>
              </label>

              <input
                id={inputId}
                type="url"
                dir="ltr"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-11 w-full rounded-[5px] border border-[#E5E5E5] bg-white px-3 text-[13px] outline-none focus:border-[#00A3D9]"
              />
            </div>
          )}

          <button
            type="button"
            disabled
            className="mx-auto mt-5 flex h-[42px] w-full max-w-[260px] cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-black text-[14px] text-white"
          >
            <SearchNormal size={20} color="currentColor" />
            <Trans>جست و جو</Trans>
          </button>
          <div
                dir="rtl"
                className="absolute bottom-4 left-4 text-[10px] text-black"
                >
                <Trans>قدرت گرفته از</Trans>{" "}
                <span className="text-[#1298C6] underline">
                    <Trans>کاشف</Trans>
                </span>
                </div>
        </div>
        
      </div>
    </div>
  );
}