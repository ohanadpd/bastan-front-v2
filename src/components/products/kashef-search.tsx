"use client";

import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  CloseCircle,
  ExportCurve,
  Gallery,
  Link2,
  SearchNormal,
} from "iconsax-reactjs";
import Link from "next/link";

export default function KashefSearch() {
  const { t } = useLingui();

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
    <div className="w-full min-w-0 rounded-[10px] border border-[#E5E5E5] bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-2 p-3 text-start sm:gap-4 sm:p-4"
      >
        <span className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/images/logos/kashef.svg"
            alt={t`کاشف`}
            width={36}
            height={36}
            className="size-7 shrink-0 sm:size-9"
          />

          <span className="min-w-0 break-words text-[14px] font-bold leading-6 text-[#353535] ">
            <Trans>
              بگرد و کشف کن. با جست و جوی تصویری، محصول مورد نظرت رو پیدا کن.
            </Trans>
          </span>
        </span>

        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary sm:size-[38px]"
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

      <div id={panelId} hidden={!isOpen} className="px-2 pb-2 sm:px-4 sm:pb-4">
        <div
          className="rounded-[5px] border border-[#EEEEEE] bg-[#FAFAFA] bg-repeat px-3 py-5 sm:px-5 md:px-8"
          style={{
            backgroundImage: "url('/images/patern-1.svg')",
          }}
        >
          <h3 className="text-center text-[16px] font-bold text-black sm:text-[18px]">
            <Trans>بگرد و کشف کن</Trans>
          </h3>

          <div className="mx-auto mt-5 grid w-full max-w-[420px] grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={searchType === "image"}
              onClick={() => setSearchType("image")}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-[11px] leading-5 sm:gap-2 sm:px-4 sm:text-[14px] ${
                searchType === "image"
                  ? "border-[#1298C6] bg-white text-[#1298C6]"
                  : "border-transparent bg-[#F2F2F2] text-[#595959]"
              }`}
            >
              <Gallery
                size={22}
                color="currentColor"
                className="size-[18px] shrink-0 sm:size-[22px]"
              />

              <span>
                <Trans>جست و جو با تصویر</Trans>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={searchType === "link"}
              onClick={() => setSearchType("link")}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-[11px] leading-5 sm:gap-2 sm:px-4 sm:text-[14px] ${
                searchType === "link"
                  ? "border-[#1298C6] bg-white text-[#1298C6]"
                  : "border-transparent bg-[#F2F2F2] text-[#595959]"
              }`}
            >
              <Link2
                size={22}
                color="currentColor"
                className="size-[18px] shrink-0 sm:size-[22px]"
              />

              <span>
                <Trans>جست و جو با لینک</Trans>
              </span>
            </button>
          </div>

          {searchType === "image" ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  setIsDragging(false);
                }
              }}
              onDrop={handleDrop}
              className={`mx-auto mt-4 flex min-h-[180px] w-full max-w-[550px] flex-col items-center justify-center rounded-[10px] border border-dashed bg-[#FCFDFE] px-3 py-5 sm:min-h-[150px] sm:p-4 ${
                isDragging ? "border-[#1298C6]" : "border-[#B5B5B5]"
              }`}
            >
              {imagePreview ? (
                <div className="relative w-full max-w-[150px]">
                  <Image
                    src={imagePreview}
                    alt={t`پیش‌نمایش تصویر انتخاب‌شده`}
                    width={150}
                    height={150}
                    unoptimized
                    className="aspect-square h-auto w-full rounded-[8px] object-contain"
                  />

                  <button
                    type="button"
                    aria-label={t`حذف تصویر`}
                    onClick={() => {
                      setImagePreview(null);
                      setFileError(false);
                    }}
                    className="absolute -end-2 -top-2 rounded-full bg-white p-1 text-primary shadow"
                  >
                    <CloseCircle size={24} color="currentColor" />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 block w-full text-center text-[12px] text-[#1298C6]"
                  >
                    <Trans>تغییر تصویر</Trans>
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex size-[46px] items-center justify-center rounded-[8px] bg-white text-[#194B63] shadow-sm">
                    <ExportCurve size={32} color="currentColor" />
                  </span>

                  <p className="mt-4 text-center text-[12px] font-bold leading-6 text-black sm:text-[14px]">
                    <Trans>تصویر را بکشید و رها کنید</Trans>
                  </p>

                  <p className="mt-2 text-center text-[12px] leading-6 text-[#5B5B5B] sm:text-[14px]">
                    <Trans>یا فایل را از سیستم</Trans>{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#1298C6] hover:underline"
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
                aria-label={t`انتخاب تصویر`}
                onChange={handleFileChange}
                className="hidden"
              />

              {fileError && (
                <p
                  role="alert"
                  className="mt-3 text-center text-[12px] text-primary"
                >
                  <Trans>لطفاً یک فایل تصویر انتخاب کنید.</Trans>
                </p>
              )}
            </div>
          ) : (
            <div className="mx-auto mt-4 flex min-h-[180px] w-full max-w-[550px] flex-col justify-center gap-3 sm:min-h-[150px]">
              <label
                htmlFor={inputId}
                className="text-[12px] text-[#353535] sm:text-[13px]"
              >
                <Trans>لینک مستقیم تصویر</Trans>
              </label>

              <input
                id={inputId}
                type="url"
                dir="ltr"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-11 w-full min-w-0 rounded-[5px] border border-[#E5E5E5] bg-white px-3 text-[12px] outline-none focus:border-[#1298C6] sm:text-[13px]"
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

          <div className="mt-5 flex w-full justify-end">
            <p dir="rtl" className="text-[10px] text-black">
              <Trans>قدرت گرفته از</Trans>{" "}
              <Link
                href="https://kashefai.ir/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1298C6]  hover:!text-[#1298C6] underline"
              >
                <Trans>کاشف</Trans>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
