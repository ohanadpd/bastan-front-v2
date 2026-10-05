
"use client";
import { useVisualizer } from "./VisualizerContext";

export function UploadStep() {
  const { roomInputRef, handleRoomUpload } = useVisualizer();
  return (
          <section className="mx-auto max-w-[980px]">
            {/* INTRO */}
            <div className="mb-7 text-center">
              <h2 className="text-[24px] font-bold tracking-tight text-[#17191c]">
                تصویر محیط را انتخاب کنید
              </h2>

              <p className="mx-auto mt-2 max-w-[560px] text-sm leading-7 text-[#7b8089]">
                یک تصویر واضح از فضای موردنظر بارگذاری کنید تا محدوده‌های موردنظر را مشخص
                کرده و کاشی‌ها را روی آن شبیه‌سازی کنید.
              </p>
            </div>

            {/* UPLOAD CARD */}
            <div className="rounded-[28px] border border-[#e1e4e8] bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <button
                type="button"
                onClick={() => roomInputRef.current?.click()}
                className="
                group flex min-h-[360px] w-full flex-col
                items-center justify-center rounded-[22px]
                border-2 border-dashed border-[#d9dde3]
                bg-background px-6 text-center
                transition-all duration-200
                hover:border-primary
                hover:bg-gray-50
              "
              >
                {/* ICON */}
                <div
                  className="
                    mb-5 flex h-[64px] w-[64px]
                    items-center justify-center rounded-2xl
                    bg-primary-light text-primary
                    transition group-hover:scale-105
                  "
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
                  </svg>
                </div>

                <div className="text-[17px] font-bold text-[#24272c]">
                  تصویر محیط را اینجا انتخاب کنید
                </div>

                <div className="mt-2 text-[13px] text-[#8b9098]">
                  برای انتخاب تصویر کلیک کنید
                </div>

                <div className="mt-5 flex items-center gap-2">
                  {["JPG", "PNG", "WEBP"].map((format) => (
                    <span
                      key={format}
                      dir="ltr"
                      className="rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#8b9098]"
                    >
                      {format}
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-[11px] text-[#a5a9b0]">
                  حداکثر حجم فایل 15 مگابایت
                </div>
              </button>

              <input
                ref={roomInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleRoomUpload}
                className="hidden"
              />
            </div>

            {/* TIPS */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[#8b9098]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                تصویر روشن و باکیفیت انتخاب کنید
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                سطح موردنظر تا حد امکان مشخص باشد
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                زاویه روبه‌روی محیط نتیجه بهتری می‌دهد
              </div>
            </div>
          </section>
  );
}
