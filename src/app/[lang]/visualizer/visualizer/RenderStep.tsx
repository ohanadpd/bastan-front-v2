
"use client";
import { useVisualizer } from "./VisualizerContext";
import { AreaTabs } from "./AreaTabs";
import VisualizerProductPicker from "@/components/visualizer/VisualizerProductPicker";

export function RenderStep() {
  const { renderCanvasRef, setStep, tile, tileOverrides, selectedTileCells, setSelectedTileCells, alternateTile, applyAlternateTile, resetSelectedTiles, handleRenderedTileClick, handleAlternateProductSelect } = useVisualizer();
  return (
          <section className="mx-auto max-w-[1500px]">
            <AreaTabs />
            {/* PAGE HEADER */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                

                <h2 className="text-[24px] font-bold text-[#17191c]">
                  نتیجه نهایی
                </h2>

                <p className="mt-2 max-w-[700px] text-sm leading-7 text-[#7b8089]">
                  برای تغییر بخشی از طرح، یک یا چند کاشی را مستقیماً از روی
                  تصویر انتخاب کنید و محصول جایگزین را از کاتالوگ انتخاب کنید.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {Object.keys(tileOverrides).length > 0 && (
                  <div className="flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {Object.keys(tileOverrides).length} کاشی تغییر یافته
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTileCells(new Set());
                    setStep("tile");
                  }}
                  className="flex h-10 items-center gap-2 rounded-xl border border-[#e1e4e8] bg-white px-4 text-xs font-semibold text-[#555b65] shadow-sm transition hover:border-[#cfd3d9] hover:bg-[#f8f9fa] hover:text-black"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  تنظیمات کاشی اصلی
                </button>
              </div>
            </div>

            {/* MAIN EDITOR */}
            <div className="grid items-start gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
              {/* RIGHT CONTROL PANEL */}
              <aside className="overflow-hidden rounded-[22px] border border-[#e1e4e8] bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)] xl:sticky xl:top-5">
                <div className="border-b border-[#eceef1] px-5 py-4">
                  <h3 className="text-sm font-bold text-[#202328]">
                    ویرایش کاشی‌ها
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-[#92969d]">
                    ابتدا کاشی‌ها را از روی تصویر انتخاب کنید.
                  </p>
                </div>

                {/* BASE PRODUCT SUMMARY */}
                <div className="border-b border-[#eceef1] p-5">
                  <div className="mb-3 text-[10px] font-semibold text-[#9a9ea5]">
                    کاشی اصلی
                  </div>

                  {tile.url ? (
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-1">
                        <img
                          src={tile.url}
                          alt={tile.productName || "کاشی اصلی"}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="line-clamp-2 text-xs font-bold leading-5 text-[#292d32]">
                          {tile.productName || "کاشی انتخاب‌شده"}
                        </div>

                        <div className="mt-1 text-[10px] text-[#9a9ea5]">
                          {tile.widthCm} × {tile.heightCm} cm
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#92969d]">
                      محصول اصلی مشخص نشده است.
                    </div>
                  )}
                </div>

                {/* SELECTION SUMMARY */}
                <div className="border-b border-[#eceef1] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-medium text-[#9a9ea5]">
                        تعداد انتخاب
                      </div>

                      <div className="mt-1 text-2xl font-black tracking-tight text-[#202328]">
                        {selectedTileCells.size}
                      </div>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        selectedTileCells.size > 0
                          ? "bg-green-100 text-green-500"
                          : "bg-[#f5f6f7] text-[#b1b5bb]"
                      }`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <path d="m15 18 2 2 4-5" />
                      </svg>
                    </div>
                  </div>

                  {selectedTileCells.size > 0 ? (
                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={resetSelectedTiles}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 text-[11px] font-semibold text-orange-700 transition hover:bg-orange-100"
                      >
                        بازگرداندن انتخاب‌ها به کاشی اصلی
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTileCells(new Set())}
                        className="h-10 w-full rounded-xl border border-[#e1e4e8] bg-white text-[11px] font-semibold text-[#6f747c] transition hover:bg-[#f7f8f9]"
                      >
                        لغو انتخاب‌ها
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl bg-[#f7f8fa] px-3.5 py-3 text-[11px] leading-5 text-[#858a92]">
                      برای فعال شدن کاتالوگ جایگزین، حداقل یک کاشی را روی تصویر
                      انتخاب کنید.
                    </div>
                  )}
                </div>

                {/* OVERRIDES */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#41464d]">
                      تغییرات اعمال‌شده
                    </span>

                    <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-emerald-50 px-2 text-[10px] font-bold text-emerald-700">
                      {Object.keys(tileOverrides).length}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eef0f2]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width:
                          Object.keys(tileOverrides).length > 0 ? "100%" : "0%",
                      }}
                    />
                  </div>

                  <p className="mt-3 text-[10px] leading-5 text-[#969ba3]">
                    هر تغییر فقط روی خانه‌های انتخاب‌شده اعمال می‌شود و سایر
                    کاشی‌ها بدون تغییر باقی می‌مانند.
                  </p>
                </div>
              </aside>
              {/* CANVAS WORKSPACE */}
              <div className="min-w-0 overflow-hidden rounded-[24px] border border-[#e1e4e8] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eceef1] px-5 py-4">
                  <div>
                    <div className="text-sm font-bold text-[#202328]">
                      پیش‌نمایش نهایی
                    </div>

                    <div className="mt-1 text-[11px] text-[#92969d]">
                      برای انتخاب یا لغو انتخاب هر کاشی، روی آن کلیک کنید.
                    </div>
                  </div>

                  <div
                    className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[11px] font-semibold ${
                      selectedTileCells.size > 0
                        ? "bg-green-100 text-green-500"
                        : "bg-[#f6f7f8] text-[#8a8f97]"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        selectedTileCells.size > 0
                          ? "bg-green-500"
                          : "bg-[#c6c9ce]"
                      }`}
                    />
                    {selectedTileCells.size > 0
                      ? `${selectedTileCells.size} کاشی انتخاب شده`
                      : "هیچ کاشی انتخاب نشده"}
                  </div>
                </div>

                <div className="bg-[#eef0f3] p-3 sm:p-5">
                  <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[18px] border border-black/[0.06] bg-[#dde1e6] p-2 sm:p-3">
                    <canvas
                      ref={renderCanvasRef}
                      onClick={handleRenderedTileClick}
                      className="block h-auto max-h-[74vh] max-w-full cursor-pointer rounded-[12px] shadow-[0_15px_45px_rgba(15,23,42,0.16)]"
                    />

                    {selectedTileCells.size === 0 && (
                      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white/95 px-4 py-2.5 text-[11px] font-medium text-[#5e636b] shadow-[0_6px_24px_rgba(15,23,42,.14)] backdrop-blur">
                        روی کاشی‌های تصویر کلیک کنید تا انتخاب شوند
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eceef1] bg-white px-5 py-4">
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#858a92]">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded border-2 border-[#ff9900] bg-[#ff9900]/20" />
                      کاشی انتخاب‌شده
                    </div>

                    
                  </div>

                  {selectedTileCells.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTileCells(new Set())}
                      className="h-9 rounded-lg border border-[#e1e4e8] bg-white px-3.5 text-[11px] font-semibold text-[#666b73] transition hover:bg-[#f7f8f9]"
                    >
                      لغو همه انتخاب‌ها
                    </button>
                  )}
                </div>
              </div>

              
            </div>

            {/* REPLACEMENT CATALOG */}
            {selectedTileCells.size > 0 && (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e1e4e8] bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eceef1] px-5 py-4">
                  <div>
                    <div className="text-sm font-bold text-[#202328]">
                      انتخاب کاشی جایگزین
                    </div>

                    <div className="mt-1 text-[11px] text-[#92969d]">
                      محصول انتخاب‌شده روی {selectedTileCells.size} کاشی اعمال
                      خواهد شد.
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#eef4ff] px-3 py-2 text-[10px] font-bold text-[#2563eb]">
                    {selectedTileCells.size} خانه انتخاب‌شده
                  </div>
                </div>

                <div className="p-5">
                  <VisualizerProductPicker
                    title=""
                    selectedProductId={alternateTile?.productId ?? null}
                    onSelect={handleAlternateProductSelect}
                  />
                </div>

                {/* ALTERNATE PRODUCT CONFIRMATION */}
                {alternateTile?.url && (
                  <div className="border-t border-[#eceef1] bg-[#fafbfc] px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#e1e4e8] bg-white p-1.5 shadow-sm">
                          <img
                            src={alternateTile.url}
                            alt={alternateTile.productName || "کاشی جایگزین"}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-[10px] font-medium text-[#9a9ea5]">
                            محصول جایگزین
                          </div>

                          <div className="mt-1 max-w-[420px] truncate text-sm font-bold text-[#292d32]">
                            {alternateTile.productName || "کاشی انتخاب‌شده"}
                          </div>

                          <div className="mt-1 text-[11px] text-[#858a92]">
                            روی {selectedTileCells.size} خانه اعمال می‌شود
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={applyAlternateTile}
                        className="flex h-11 items-center gap-2 rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(37,99,235,.20)] transition hover:bg-[#1d4ed8]"
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                        اعمال تغییر
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            
          </section>
  );
}
