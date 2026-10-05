
"use client";
import Image from "next/image";
import {
  type Step,
  useVisualizerController,
  VisualizerContext,
  UploadStep,
  MaskStep,
  PerspectiveStep,
  TileStep,
  RenderStep,
} from "tile-visualizer";

export default function VisualizerPage() {
  const controller = useVisualizerController();
  const { step, error, room, perspectivePoints } = controller;
  return (
    <VisualizerContext.Provider value={controller}>
    <main
      dir="rtl"
      className="min-h-screen bg-background text-[#17191c] selection:bg-[#2563eb]/15"
    >
      {/* =========================================
      VISUALIZER HEADER
  ========================================= */}

      <header className="border-b border-black/[0.07] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 lg:px-8">
          {/* TITLE */}

          <div className="flex items-center gap-3">
            <Image
              src="https://contino-bastan.bastantile.com/media/site/Asset_24x.png"
              alt="کاشی باستان"
              width={40}
              height={40}
              className="object-contain"
            />

            <div>
              <div className="text-[15px] font-bold text-[#15171a]">
                شبیه‌ساز کاشی
              </div>

              <div
                dir="ltr"
                className="mt-0.5 text-[11px] font-medium tracking-[0.12em] text-[#9a9da3]"
              >
                BASTAN VISUALIZER
              </div>
            </div>
          </div>

          {/* BACK TO SITE */}

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#555b65] transition hover:border-[#cfd3d9] hover:bg-[#f8f9fa] hover:text-black"
          >
            <span className="text-lg">←</span>
            بازگشت به سایت
          </button>
        </div>
      </header>

      {/* =========================================
      STEPPER
  ========================================= */}

      <div className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-5">
          <div className="flex items-start justify-between">
            {[
              {
                id: "upload",
                number: 1,
                label: "تصویر محیط",
              },
              {
                id: "mask",
                number: 2,
                label: "محدوده کف",
              },
              {
                id: "perspective",
                number: 3,
                label: "تنظیم زاویه دید",
              },
              {
                id: "tile",
                number: 4,
                label: "انتخاب کاشی",
              },
              {
                id: "render",
                number: 5,
                label: "نتیجه نهایی",
              },
            ].map((item, index, items) => {
              const steps: Step[] = [
                "upload",
                "mask",
                "perspective",
                "tile",
                "render",
              ];

              const currentIndex = steps.indexOf(step);
              const itemIndex = steps.indexOf(item.id as Step);

              const active = item.id === step;

              const completed = itemIndex < currentIndex;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {/* CONNECTOR */}

                  {index < items.length - 1 && (
                    <div
                      className={`absolute right-1/2 top-[17px] h-[2px] w-full ${
                        itemIndex < currentIndex ? "bg-primary" : "bg-[#e6e8ec]"
                      }`}
                    />
                  )}

                  {/* CIRCLE */}

                  <div
                    className={`
                  relative z-10 flex h-[34px] w-[34px]
                  items-center justify-center rounded-full
                  border text-xs font-bold transition-all
                  ${
                    active
                      ? "border-primary bg-primary text-white shadow-[0_0_0_5px_rgba(37,99,235,0.10)]"
                      : completed
                        ? "border-primary bg-primary text-white"
                        : "border-[#dfe2e7] bg-white text-[#9da1a8]"
                  }
                `}
                  >
                    {completed ? "✓" : item.number}
                  </div>

                  {/* LABEL */}

                  <div
                    className={`mt-2.5 whitespace-nowrap text-[12px] font-medium ${
                      active
                        ? "text-[#17191c]"
                        : completed
                          ? "text-[#9da1a8]"
                          : "text-[#9da1a8]"
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================
      PAGE CONTENT
  ========================================= */}

      <div className="mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {step === "upload" && <UploadStep />}
        {step === "mask" && room.url && <MaskStep />}
        {step === "perspective" && room.url && perspectivePoints && <PerspectiveStep />}
        {step === "tile" && <TileStep />}
        {step === "render" && <RenderStep />}
      </div>
    </main>
    </VisualizerContext.Provider>
  );
}
