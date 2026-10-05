
"use client";
import { useVisualizer } from "./VisualizerContext";
import { AreaTabs } from "./AreaTabs";
import VisualizerProductPicker from "@/components/visualizer/VisualizerProductPicker";

export function TileStep() {
  const { setStep, room, areas, perspectivePoints, tile, setTile, setTileOverrides, grout, setGrout, setSelectedTileCells, finishTile, polygonPoints, handleBaseProductSelect } = useVisualizer();
  return (
          <section className="mx-auto max-w-[1500px]">
            <AreaTabs />
            {/* HEADER */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                

                <h2 className="text-[24px] font-bold text-[#17191c]">
                  کاشی موردنظر را انتخاب کنید
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#7b8089]">
                  محصول موردنظر را از کاتالوگ انتخاب کرده و تنظیمات نمایش آن را
                  مشخص کنید.
                </p>
              </div>

              {tile.productName && (
                <div className="flex items-center gap-3 rounded-xl border border-[#e2e5e9] bg-white px-3 py-2 shadow-sm">
                  {tile.url && (
                    <div className="h-9 w-9 overflow-hidden rounded-lg border border-[#eceef1] bg-white">
                      <img
                        src={tile.url}
                        alt={tile.productName}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] text-[#9a9ea5]">
                      محصول انتخاب‌شده
                    </div>

                    <div className="max-w-[180px] truncate text-xs font-semibold text-[#34383e]">
                      {tile.productName}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MAIN LAYOUT */}
            <div className="grid items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
              {/* =====================================
          SETTINGS SIDEBAR
      ===================================== */}

              <aside className="overflow-hidden rounded-[22px] border border-[#e1e4e8] bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)] xl:sticky xl:top-5">
                <div className="border-b border-[#eceef1] px-5 py-4">
                  <h3 className="text-sm font-bold text-[#202328]">
                    تنظیمات کاشی
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-[#92969d]">
                    اندازه، جهت، تراکم و بندکشی را تنظیم کنید.
                  </p>
                </div>

                {/* SELECTED PRODUCT */}
                {tile.url ? (
                  <div className="border-b border-[#eceef1] p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-1.5">
                        <img
                          src={tile.url}
                          alt={tile.productName || "کاشی"}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-[#9a9ea5]">
                          کاشی اصلی
                        </div>

                        <div className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-[#292d32]">
                          {tile.productName || "کاشی انتخاب‌شده"}
                        </div>

                        {tile.variantId && (
                          <div
                            dir="ltr"
                            className="mt-1 text-[10px] text-[#a0a4ab]"
                          >
                            Variant #{tile.variantId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-[#eceef1] p-5">
                    <div className="rounded-xl bg-[#f7f8fa] p-4 text-center text-xs leading-6 text-[#92969d]">
                      ابتدا یک محصول از کاتالوگ انتخاب کنید.
                    </div>
                  </div>
                )}

                {/* SIZE */}
                <div className="border-b border-[#eceef1] p-5">
                  <div className="mb-3 text-xs font-bold text-[#41464d]">
                    ابعاد کاشی
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="text-[11px] text-[#7d828a]">
                      عرض
                      <div className="relative mt-1.5">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={tile.widthCm}
                          onChange={(event) => {
                            const value = Number(event.target.value);

                            setTile((previous) => ({
                              ...previous,
                              widthCm: value,
                            }));

                            setTileOverrides({});
                            setSelectedTileCells(new Set());
                          }}
                          className="h-10 w-full rounded-xl border border-[#e1e4e8] bg-[#fafbfc] px-3 pl-8 text-sm text-[#292d32] outline-none transition focus:border-[#2563eb] focus:bg-white"
                        />

                        <span
                          dir="ltr"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#a0a4ab]"
                        >
                          cm
                        </span>
                      </div>
                    </label>

                    <label className="text-[11px] text-[#7d828a]">
                      طول
                      <div className="relative mt-1.5">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={tile.heightCm}
                          onChange={(event) => {
                            const value = Number(event.target.value);

                            setTile((previous) => ({
                              ...previous,
                              heightCm: value,
                            }));

                            setTileOverrides({});
                            setSelectedTileCells(new Set());
                          }}
                          className="h-10 w-full rounded-xl border border-[#e1e4e8] bg-[#fafbfc] px-3 pl-8 text-sm text-[#292d32] outline-none transition focus:border-[#2563eb] focus:bg-white"
                        />

                        <span
                          dir="ltr"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#a0a4ab]"
                        >
                          cm
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* ROTATION */}
                <div className="border-b border-[#eceef1] p-5">
                  <div className="mb-3 text-xs font-bold text-[#41464d]">
                    جهت قرارگیری
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[0, 90].map((rotation) => (
                      <button
                        key={rotation}
                        type="button"
                        onClick={() => {
                          setTile((previous) => ({
                            ...previous,
                            rotation: rotation as 0 | 90,
                          }));

                          setTileOverrides({});
                          setSelectedTileCells(new Set());
                        }}
                        className={`h-10 rounded-xl border text-xs font-semibold transition ${
                          tile.rotation === rotation
                            ? "border-[#2563eb] bg-[#eef4ff] text-[#2563eb]"
                            : "border-[#e1e4e8] bg-white text-[#777c84] hover:bg-[#f8f9fa]"
                        }`}
                      >
                        {rotation === 0 ? "افقی" : "عمودی"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DENSITY */}
                <div className="border-b border-[#eceef1] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#41464d]">
                      مقیاس نمایش
                    </span>

                    <span className="rounded-md bg-[#eef4ff] px-2 py-1 text-[10px] font-bold text-[#2563eb]">
                      {tile.density}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={tile.density}
                    onChange={(event) => {
                      const value = Number(event.target.value);

                      setTile((previous) => ({
                        ...previous,
                        density: value,
                      }));

                      setTileOverrides({});
                      setSelectedTileCells(new Set());
                    }}
                    className="w-full accent-[#2563eb]"
                  />

                  <div className="mt-2 flex justify-between text-[9px] text-[#a1a5ac]">
                    <span>درشت‌تر</span>
                    <span>ریزتر</span>
                  </div>
                </div>

                {/* GROUT */}
                <div className="p-5">
                  <div className="mb-3 text-xs font-bold text-[#41464d]">
                    بندکشی
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] text-[#7d828a]">
                      عرض بند
                      <div className="relative mt-1.5">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={grout.widthMm}
                          onChange={(event) =>
                            setGrout((previous) => ({
                              ...previous,
                              widthMm: Number(event.target.value),
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-[#e1e4e8] bg-[#fafbfc] px-3 pl-9 text-sm text-[#292d32] outline-none transition focus:border-[#2563eb] focus:bg-white"
                        />

                        <span
                          dir="ltr"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#a0a4ab]"
                        >
                          mm
                        </span>
                      </div>
                    </label>

                    <div>
                      <div className="mb-1.5 text-[11px] text-[#7d828a]">
                        رنگ بند
                      </div>

                      <div className="flex h-11 items-center gap-3 rounded-xl border border-[#e1e4e8] bg-[#fafbfc] px-2.5">
                        <input
                          type="color"
                          value={grout.color}
                          onChange={(event) =>
                            setGrout((previous) => ({
                              ...previous,
                              color: event.target.value,
                            }))
                          }
                          className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                        />

                        <span
                          dir="ltr"
                          className="text-[11px] font-medium text-[#777c84]"
                        >
                          {grout.color}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* =====================================
          PRODUCT CATALOG + PREVIEW
      ===================================== */}

              <div className="min-w-0 space-y-5">
                {/* PRODUCT PICKER */}
                <div className="overflow-hidden rounded-[22px] border border-[#e1e4e8] bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)]">
                  <div className="p-5">
                    <VisualizerProductPicker
                      title="انتخاب کاشی اصلی"
                      selectedProductId={tile.productId}
                      onSelect={handleBaseProductSelect}
                    />
                  </div>
                </div>

                {/* ROOM PREVIEW */}
                <div className="overflow-hidden rounded-[22px] border border-[#e1e4e8] bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eceef1] px-5 py-4">
                    <div>
                      <div className="text-sm font-bold text-[#202328]">
                        پیش‌نمایش محیط
                      </div>

                      <div className="mt-1 text-[11px] text-[#92969d]">
                        محدوده و زاویه دید انتخاب‌شده
                      </div>
                    </div>

                    {tile.productName && (
                      <div className="max-w-[220px] truncate rounded-lg bg-[#eef4ff] px-3 py-2 text-[11px] font-medium text-[#2563eb]">
                        {tile.productName}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f4f5f7] p-3 sm:p-5">
                    {room.url ? (
                      <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-[16px] bg-white shadow-[0_8px_30px_rgba(15,23,42,.10)] ring-1 ring-black/[0.05]">
                        <img
                          src={room.url}
                          alt="Room preview"
                          draggable={false}
                          className="block max-h-[62vh] max-w-full select-none"
                        />

                        <svg
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute inset-0 h-full w-full"
                        >
                          <polygon
                            points={polygonPoints}
                            fill="rgba(37,99,235,.12)"
                            stroke="#3b82f6"
                            strokeWidth=".3"
                            vectorEffect="non-scaling-stroke"
                          />

                          {perspectivePoints && (
                            <polygon
                              points={[
                                perspectivePoints.TL,
                                perspectivePoints.TR,
                                perspectivePoints.BR,
                                perspectivePoints.BL,
                              ]
                                .map(
                                  (point) =>
                                    `${point.x * 100},${point.y * 100}`,
                                )
                                .join(" ")}
                              fill="rgba(245,158,11,.04)"
                              stroke="rgba(245,158,11,.8)"
                              strokeWidth=".25"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                        </svg>
                      </div>
                    ) : (
                      <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white text-sm text-[#9ca1a9]">
                        تصویر محیط موجود نیست.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================
        BOTTOM ACTION BAR
    ===================================== */}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#e1e4e8] bg-white px-5 py-4 shadow-[0_5px_20px_rgba(15,23,42,.04)]">
              <button
                type="button"
                onClick={() => setStep("perspective")}
                className="h-11 rounded-xl border border-[#e1e4e8] bg-white px-5 text-sm font-medium text-[#646971] transition hover:bg-[#f7f8f9]"
              >
                برگشت به تنظیم زاویه دید
              </button>

              <div className="flex items-center gap-4">
                {!tile.url && (
                  <span className="hidden text-xs text-[#969ba3] sm:block">
                    برای ادامه یک کاشی انتخاب کنید
                  </span>
                )}

                <button
                  type="button"
                  disabled={areas.some((area) => !area.tile.url)}
                  onClick={finishTile}
                  className="
            flex h-11 items-center gap-2 rounded-xl
            bg-primary px-6 text-sm font-semibold text-white
            shadow-[0_5px_15px_rgba(37,99,235,.20)]
            transition 
            disabled:cursor-not-allowed disabled:bg-[#cbd5e1]
            disabled:shadow-none
          "
                >
                  <span>مشاهده نتیجه</span>
                  <span className="text-lg">←</span>
                </button>
              </div>
            </div>
          </section>
  );
}
