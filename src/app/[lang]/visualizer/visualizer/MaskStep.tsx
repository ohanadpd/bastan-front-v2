
"use client";
import { useVisualizer } from "./VisualizerContext";
import { AreaTabs } from "./AreaTabs";

export function MaskStep() {
  const { imageWrapperRef, setStep, room, areas, setAreas, activeAreaId, setActiveAreaId, maskPoints, setMaskPoints, setDraggingMaskIndex, handleMaskAreaClick, handleMaskMouseMove, finishMask, polygonPoints } = useVisualizer();
  if (!room.url) return null;
  return (
          <section className="mx-auto max-w-[1500px]">
            <AreaTabs showAdd />
            {/* PAGE TITLE */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-bold text-[#17191c]">محدوده‌های موردنظر را مشخص کنید</h2>
                <p className="mt-2 text-sm leading-7 text-[#7b8089]">روی گوشه‌های محدوده کلیک کنید. نقاط را می‌توانید بعداً با ماوس جابه‌جا کنید.</p>
              </div>

              {/* POINT COUNT */}
              <div className="flex h-11 items-center gap-3 rounded-xl border border-[#e2e5e9] bg-white px-4 shadow-sm">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-primary-light px-1.5 text-xs font-bold text-primary">
                  {maskPoints.length}
                </span>

                <span className="text-xs font-medium text-[#6f747c]">
                  نقطه انتخاب شده
                </span>
              </div>
            </div>

            {/* EDITOR SHELL */}
            <div className="space-y-5">
              <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                {/* =====================================
                    TOOL PANEL
                ===================================== */}

                <aside className="overflow-hidden rounded-[22px] border border-[#e1e4e8] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.05)]">
                  <div className="text-sm font-bold text-[#202328]">
                    راهنمای انتخاب محدوده
                  </div>

                  <p className="mt-2 text-xs leading-6 text-[#858a92]">
                    مرز قابل مشاهده سطح را با چند نقطه مشخص کنید.
                  </p>

                  {/* STEPS */}
                  <div className="mt-6 space-y-5">
                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-light text-[11px] font-bold text-primary">
                        1
                      </span>

                      <div>
                        <div className="text-xs font-semibold text-[#34383e]">
                          گوشه‌ها را انتخاب کنید
                        </div>

                        <div className="mt-1 text-[11px] leading-5 text-[#969ba3]">
                          روی هر گوشه از محدوده یک‌بار کلیک کنید.
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-light text-[11px] font-bold text-primary">
                        2
                      </span>

                      <div>
                        <div className="text-xs font-semibold text-[#34383e]">
                          نقاط را تنظیم کنید
                        </div>

                        <div className="mt-1 text-[11px] leading-5 text-[#969ba3]">
                          هر نقطه آبی را بگیرید و به محل دقیق‌تر بکشید.
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-light text-[11px] font-bold text-primary">
                        3
                      </span>

                      <div>
                        <div className="text-xs font-semibold text-[#34383e]">
                          محدوده را تأیید کنید
                        </div>

                        <div className="mt-1 text-[11px] leading-5 text-[#969ba3]">
                          حداقل سه نقطه برای ادامه لازم است.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="my-6 h-px bg-[#eceef1]" />

                  {/* EDIT ACTIONS */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={maskPoints.length === 0}
                      onClick={() =>
                        setMaskPoints((previous) => previous.slice(0, -1))
                      }
                      className="
                flex h-10 w-full items-center justify-between
                rounded-xl border border-[#e3e6ea] px-3.5
                text-xs font-medium text-[#5f646c]
                transition hover:bg-[#f7f8f9]
                disabled:cursor-not-allowed disabled:opacity-40
              "
                    >
                      <span>حذف آخرین نقطه</span>
                      <span className="text-base text-[#92969d]">↶</span>
                    </button>

                    <button
                      type="button"
                      disabled={maskPoints.length === 0}
                      onClick={() => setMaskPoints([])}
                      className="
                flex h-10 w-full items-center justify-between
                rounded-xl border border-[#e3e6ea] px-3.5
                text-xs font-medium text-[#5f646c]
                transition hover:bg-[#f7f8f9]
                disabled:cursor-not-allowed disabled:opacity-40
              "
                    >
                      <span>شروع مجدد</span>
                      <span className="text-base text-[#92969d]">↻</span>
                    </button>
                  </div>

                  {/* STATUS */}
                  <div
                    className={`mt-5 rounded-xl px-3.5 py-3 text-[11px] leading-5 ${
                      maskPoints.length >= 3
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[#f6f7f8] text-[#858a92]"
                    }`}
                  >
                    {maskPoints.length >= 3
                      ? "محدوده قابل تأیید است. در صورت نیاز نقاط را دقیق‌تر تنظیم کنید."
                      : `${Math.max(
                          0,
                          3 - maskPoints.length,
                        )} نقطه دیگر برای تشکیل محدوده لازم است.`}
                  </div>
                </aside>
                {/* =====================================
                    IMAGE WORKSPACE
                ===================================== */}

                <div className="min-w-0 overflow-hidden rounded-[24px] border border-[#e1e4e8] bg-[#f4f5f7] p-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-5">
                  <div
                    ref={imageWrapperRef}
                    onClick={handleMaskAreaClick}
                    onMouseMove={handleMaskMouseMove}
                    onMouseUp={() => setDraggingMaskIndex(null)}
                    onMouseLeave={() => setDraggingMaskIndex(null)}
                    className="
              relative mx-auto w-fit max-w-full
              cursor-crosshair overflow-hidden
              rounded-[16px] bg-black
              shadow-[0_15px_50px_rgba(0,0,0,.25)]
            "
                  >
                    <img
                      src={room.url}
                      alt="Room"
                      draggable={false}
                      className="block max-h-[68vh] max-w-full select-none"
                    />

                    {/* MASK */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    >
                      {areas.filter((area) => area.id !== activeAreaId && area.points.length >= 3).map((area) => (
                        <polygon key={area.id}
                          points={area.points.map((point) => `${point.x * 100},${point.y * 100}`).join(" ")}
                          fill="rgba(16,185,129,.12)" stroke="#10b981" strokeWidth=".35"
                          vectorEffect="non-scaling-stroke" />
                      ))}
                      {maskPoints.length >= 3 && (
                        <polygon
                          points={polygonPoints}
                          fill="rgba(37,99,235,.20)"
                          stroke="#3b82f6"
                          strokeWidth=".35"
                          vectorEffect="non-scaling-stroke"
                        />
                      )}

                      {/* CONNECT POINTS BEFORE POLYGON IS COMPLETE */}
                      {maskPoints.length >= 2 && maskPoints.length < 3 && (
                        <polyline
                          points={polygonPoints}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth=".35"
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                    </svg>

                    {/* POINTS */}
                    {maskPoints.map((point, index) => (
                      <button
                        key={index}
                        type="button"
                        data-point="true"
                        onMouseDown={(event) => {
                          event.stopPropagation();
                          setDraggingMaskIndex(index);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="
                          absolute z-20 flex h-[18px] w-[18px]
                          -translate-x-1/2 -translate-y-1/2
                          items-center justify-center rounded-full
                          border-[2px] border-white 
                          shadow-[0_2px_10px_rgba(0,0,0,.45)]
                          transition-transform hover:scale-125
                        "
                        style={{
                          left: `${point.x * 100}%`,
                          top: `${point.y * 100}%`,
                        }}
                        title={`نقطه ${index + 1}`}
                      />
                    ))}

                    {/* EMPTY STATE ON IMAGE */}
                    {maskPoints.length === 0 && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center px-4">
                        <div className="rounded-xl bg-black/70 px-4 py-2.5 text-center text-xs text-white shadow-lg backdrop-blur-md">
                          برای شروع روی اولین گوشه محدوده کلیک کنید
                        </div>
                      </div>
                    )}
                  </div>
                </div>

               
              </div>

              {/* =====================================
          BOTTOM ACTION BAR
      ===================================== */}

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#e1e4e8] bg-white px-5 py-4 shadow-[0_5px_20px_rgba(15,23,42,.04)]">
                <button
                  type="button"
                  onClick={() => {
                    setAreas([]);
                    setActiveAreaId(null);
                    setStep("upload");
                  }}
                  className="
            h-11 rounded-xl border border-[#e1e4e8]
            bg-white px-5 text-sm font-medium text-[#646971]
            transition hover:bg-[#f7f8f9]
          "
                >
                  تغییر تصویر
                </button>

                <button
                  type="button"
                  disabled={areas.some((area) => area.points.length < 3)}
                  onClick={finishMask}
                  className="
            flex h-11 items-center gap-2 rounded-xl
            bg-primary px-6 text-sm font-semibold text-white
            shadow-[0_5px_15px_rgba(37,99,235,.20)]
            transition 
            disabled:cursor-not-allowed disabled:bg-[#cbd5e1]
            disabled:shadow-none
          "
                >
                  <span>تأیید محدوده‌ها</span>
                  <span className="text-lg">←</span>
                </button>
              </div>
            </div>
          </section>
  );
}
