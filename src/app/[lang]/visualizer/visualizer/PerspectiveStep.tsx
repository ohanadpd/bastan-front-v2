
"use client";
import { useVisualizer } from "./VisualizerContext";
import { AreaTabs } from "./AreaTabs";
import { projectPoint } from "./geometry";
import type { PerspectiveKey } from "./types";

export function PerspectiveStep() {
  const { imageWrapperRef, setStep, room, perspectivePoints, setDraggingPerspectivePoint, handlePerspectiveMouseMove, resetPerspective, finishPerspective, polygonPoints, perspectivePolygon, homography, gridColumns, gridRows } = useVisualizer();
  if (!room.url || !perspectivePoints) return null;
  return (
          <section className="mx-auto max-w-[1500px]">
            <AreaTabs />
            {/* PAGE TITLE */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-bold text-[#17191c]">تنظیم زاویه دید</h2>
                <p className="mt-2 text-sm leading-7 text-[#7b8089]">چهار نقطه نارنجی را جابه‌جا کنید تا خطوط شبکه با جهت واقعی محدوده هماهنگ شوند.</p>
              </div>

             
            </div>

            {/* EDITOR */}
            <div className="space-y-5">
              <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                

                {/* CONTROL PANEL */}
                <aside className="overflow-hidden rounded-[22px] border border-[#e1e4e8] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.05)]">
                  <div className="text-sm font-bold text-[#202328]">
                    تنظیم زاویه دید
                  </div>

                  <p className="mt-2 text-xs leading-6 text-[#858a92]">
                    خطوط سفید باید با امتداد واقعی خطوط محدوده هماهنگ باشند.
                  </p>

                  {/* GUIDE */}
                  <div className="mt-6 space-y-5">
                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff4e8] text-xs font-bold text-[#f59e0b]">
                        1
                      </span>

                      <div>
                        <div className="text-xs font-semibold text-[#34383e]">
                          نقاط نارنجی را بکشید
                        </div>

                        <p className="mt-1 text-[11px] leading-5 text-[#969ba3]">
                          هر نقطه را با گوشه‌های فرضی سطح انتخاب‌شده هماهنگ کنید.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f4f5f6] text-xs font-bold text-[#747981]">
                        2
                      </span>

                      <div>
                        <div className="text-xs font-semibold text-[#34383e]">
                          جهت شبکه را بررسی کنید
                        </div>

                        <p className="mt-1 text-[11px] leading-5 text-[#969ba3]">
                          خطوط شبکه باید در عمق تصویر به شکل طبیعی همگرا شوند.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-[#eceef1]" />

                  {/* RESET */}
                  <button
                    type="button"
                    onClick={resetPerspective}
                    className="
              flex h-10 w-full items-center justify-between
              rounded-xl border border-[#e3e6ea] px-3.5
              text-xs font-medium text-[#5f646c]
              transition hover:bg-[#f7f8f9]
            "
                  >
                    <span>بازنشانی زاویه دید</span>
                    <span className="text-base text-[#92969d]">↻</span>
                  </button>

                  {/* LEGEND */}
                  <div className="mt-5 rounded-xl bg-[#f7f8fa] p-4">
                    <div className="mb-3 text-[11px] font-semibold text-[#656a72]">
                      راهنمای خطوط
                    </div>

                    <div className="space-y-3 text-[11px] text-[#858a92]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                        محدوده انتخاب‌شده
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                        نقاط زاویه دید
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="h-[2px] w-3 bg-[#9ca3af]" />
                        شبکه جهت کاشی
                      </div>
                    </div>
                  </div>
                </aside>
                {/* IMAGE WORKSPACE */}
                <div className="min-w-0 overflow-hidden rounded-[24px] border border-[#e1e4e8] bg-[#f4f5f7] p-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-5">
                  <div
                    ref={imageWrapperRef}
                    onMouseMove={handlePerspectiveMouseMove}
                    onMouseUp={() => setDraggingPerspectivePoint(null)}
                    onMouseLeave={() => setDraggingPerspectivePoint(null)}
                    className="
                      relative mx-auto w-fit max-w-full
                      overflow-hidden rounded-[16px] bg-white
                      shadow-[0_8px_30px_rgba(15,23,42,.10)]
                      ring-1 ring-black/[0.05]
                    "
                  >
                    <img
                      src={room.url}
                      alt="Room"
                      draggable={false}
                      className="block max-h-[68vh] max-w-full select-none"
                    />

                    {/* MASK + PERSPECTIVE + GRID */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    >
                      {/* FLOOR MASK */}
                      <polygon
                        points={polygonPoints}
                        fill="rgba(37,99,235,.10)"
                        stroke="rgba(37,99,235,.65)"
                        strokeWidth=".3"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* PERSPECTIVE QUAD */}
                      <polygon
                        points={perspectivePolygon}
                        fill="rgba(245,158,11,.06)"
                        stroke="#f59e0b"
                        strokeWidth=".4"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* VERTICAL GRID */}
                      {homography &&
                        Array.from({
                          length: gridColumns - 1,
                        }).map((_, index) => {
                          const u = (index + 1) / gridColumns;

                          const p0 = projectPoint(u, 0, homography);
                          const p1 = projectPoint(u, 1, homography);

                          if (!p0 || !p1) {
                            return null;
                          }

                          return (
                            <line
                              key={`vertical-${index}`}
                              x1={p0.x * 100}
                              y1={p0.y * 100}
                              x2={p1.x * 100}
                              y2={p1.y * 100}
                              stroke="rgba(255,255,255,.82)"
                              strokeWidth=".22"
                              vectorEffect="non-scaling-stroke"
                            />
                          );
                        })}

                      {/* HORIZONTAL GRID */}
                      {homography &&
                        Array.from({
                          length: gridRows - 1,
                        }).map((_, index) => {
                          const v = (index + 1) / gridRows;

                          const p0 = projectPoint(0, v, homography);
                          const p1 = projectPoint(1, v, homography);

                          if (!p0 || !p1) {
                            return null;
                          }

                          return (
                            <line
                              key={`horizontal-${index}`}
                              x1={p0.x * 100}
                              y1={p0.y * 100}
                              x2={p1.x * 100}
                              y2={p1.y * 100}
                              stroke="rgba(255,255,255,.82)"
                              strokeWidth=".22"
                              vectorEffect="non-scaling-stroke"
                            />
                          );
                        })}
                    </svg>

                    {/* DRAG POINTS */}
                    {(Object.keys(perspectivePoints) as PerspectiveKey[]).map(
                      (key) => {
                        const point = perspectivePoints[key];

                        return (
                          <button
                            key={key}
                            type="button"
                            onMouseDown={() => setDraggingPerspectivePoint(key)}
                            className="
                      absolute z-20 flex h-6 w-6
                      -translate-x-1/2 -translate-y-1/2
                      cursor-grab items-center justify-center
                      rounded-full border-[3px] border-white
                      bg-[#f59e0b]
                      shadow-[0_3px_12px_rgba(0,0,0,.35)]
                      transition-transform hover:scale-125
                      active:cursor-grabbing
                    "
                            style={{
                              left: `${point.x * 100}%`,
                              top: `${point.y * 100}%`,
                            }}
                            title={key}
                          >
                            <span className="text-[7px] font-bold text-white">
                              {key}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM ACTION BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#e1e4e8] bg-white px-5 py-4 shadow-[0_5px_20px_rgba(15,23,42,.04)]">
                <button
                  type="button"
                  onClick={() => setStep("mask")}
                  className="
            h-11 rounded-xl border border-[#e1e4e8]
            bg-white px-5 text-sm font-medium text-[#646971]
            transition hover:bg-[#f7f8f9]
          "
                >
                  برگشت به محدوده‌ها
                </button>

                <button
                  type="button"
                  onClick={finishPerspective}
                  className="
            flex h-11 items-center gap-2 rounded-xl
            bg-primary px-6 text-sm font-semibold text-white
            shadow-[0_5px_15px_rgba(37,99,235,.20)]
            transition 
          "
                >
                  <span>تأیید زاویه دید</span>
                  <span className="text-lg">←</span>
                </button>
              </div>
            </div>
          </section>
  );
}
