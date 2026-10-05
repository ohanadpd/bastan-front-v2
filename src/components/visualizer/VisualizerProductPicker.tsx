"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  Product,
  Variant,
  AttributeValue,
  ProductListResponse,
} from "@/types/products.types";

type Props = {
  title?: string;
  selectedProductId?: number | null;
  onSelect: (
    product: Product,
    data: {
      image: string;
      widthCm: number | null;
      heightCm: number | null;
      variant: Variant | null;
    }
  ) => void;
};

function normalizePersianNumbers(value: string) {
  const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
  const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";

  return value
    .split("")
    .map((character) => {
      const persianIndex = persianNumbers.indexOf(character);
      if (persianIndex !== -1) return String(persianIndex);

      const arabicIndex = arabicNumbers.indexOf(character);
      if (arabicIndex !== -1) return String(arabicIndex);

      return character;
    })
    .join("");
}

function parseSizeValue(
  value: string | null
): { widthCm: number; heightCm: number } | null {
  if (!value) return null;

  const normalized = normalizePersianNumbers(value)
    .replace(/×/g, "x")
    .replace(/\*/g, "x")
    .replace(/\s+/g, "")
    .toLowerCase();

  const match = normalized.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);

  if (!match) return null;

  const widthCm = Number(match[1]);
  const heightCm = Number(match[2]);

  if (
    !Number.isFinite(widthCm) ||
    !Number.isFinite(heightCm) ||
    widthCm <= 0 ||
    heightCm <= 0
  ) {
    return null;
  }

  return { widthCm, heightCm };
}

function isSizeAttribute(attribute: AttributeValue) {
  const name = attribute.attribute_name?.trim().toLowerCase() ?? "";

  return (
    name.includes("سایز") ||
    name.includes("ابعاد") ||
    name.includes("اندازه") ||
    name.includes("size") ||
    name.includes("dimension")
  );
}

function findProductSize(
  product: Product
): { widthCm: number; heightCm: number } | null {
  const productVariants = Array.isArray(product.variants)
    ? product.variants
    : [];

  if (productVariants.length === 0) return null;

  const defaultVariant = productVariants.find((variant) => variant.default);

  const variants = defaultVariant
    ? [
        defaultVariant,
        ...productVariants.filter(
          (variant) => variant.id !== defaultVariant.id
        ),
      ]
    : productVariants;

  for (const variant of variants) {
    const attributes = Array.isArray(variant.attribute_values)
      ? variant.attribute_values
      : [];

    for (const attribute of attributes) {
      if (!isSizeAttribute(attribute)) continue;

      const parsed = parseSizeValue(attribute.value);
      if (parsed) return parsed;
    }
  }

  for (const variant of variants) {
    const attributes = Array.isArray(variant.attribute_values)
      ? variant.attribute_values
      : [];

    for (const attribute of attributes) {
      const parsed = parseSizeValue(attribute.value);
      if (parsed) return parsed;
    }
  }

  return null;
}

function getDefaultVariant(product: Product): Variant | null {
  const variants = Array.isArray(product.variants) ? product.variants : [];

  return variants.find((variant) => variant.default) ?? variants[0] ?? null;
}

function getProductImage(product: Product) {
  const variant = getDefaultVariant(product);

  const image =
    variant?.image || product.image || product.image_thumbnail || "";

  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    try {
      const url = new URL(image);
      return `/api/visualizer/media?path=${encodeURIComponent(url.pathname)}`;
    } catch {
      return image;
    }
  }

  const imagePath = image.startsWith("/") ? image : `/${image}`;

  return `/api/visualizer/media?path=${encodeURIComponent(imagePath)}`;
}

export default function VisualizerProductPicker({
  title = "انتخاب کاشی",
  selectedProductId = null,
  onSelect,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const loadProducts = useCallback(async (targetPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/visualizer/products?page=${targetPage}&limit=${pageSize}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Products request failed: ${response.status}`);
      }

      const result: ProductListResponse = await response.json();
      const pagination = result.data;

      setProducts(pagination.results ?? []);
      setCount(pagination.count ?? 0);
      setHasNext(Boolean(pagination.next));
      setHasPrevious(Boolean(pagination.previous));
      setPage(targetPage);
    } catch (requestError: any) {
      console.error("VISUALIZER PRODUCT ERROR:", requestError);

      if (
        requestError?.code === "ECONNABORTED" ||
        requestError?.code === "ETIMEDOUT" ||
        requestError?.message?.toLowerCase().includes("timeout")
      ) {
        setError("سرور محصولات دیر پاسخ داد. دوباره تلاش کنید.");
        return;
      }

      setError("دریافت محصولات با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handleSelect = (product: Product) => {
    const image = getProductImage(product);

    if (!image) {
      setError("برای این محصول تصویر قابل استفاده وجود ندارد.");
      return;
    }

    const size = findProductSize(product);
    const variant = getDefaultVariant(product);

    onSelect(product, {
      image,
      widthCm: size?.widthCm ?? null,
      heightCm: size?.heightCm ?? null,
      variant,
    });
  };

  const paginationItems = useMemo(() => {
    const items: Array<number | "left-ellipsis" | "right-ellipsis"> = [];

    if (totalPages <= 7) {
      for (let number = 1; number <= totalPages; number += 1) {
        items.push(number);
      }
      return items;
    }

    items.push(1);

    if (page > 4) items.push("left-ellipsis");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let number = start; number <= end; number += 1) {
      items.push(number);
    }

    if (page < totalPages - 3) items.push("right-ellipsis");

    items.push(totalPages);

    return items;
  }, [page, totalPages]);

  const retry = () => loadProducts(page);

  return (
    <div className="w-full bg-white text-[#17191c]">
      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && (
            <h3 className="text-sm font-bold text-[#202328]">{title}</h3>
          )}

          {!loading && products.length > 0 && (
            <div className={`${title ? "mt-1" : ""} text-[11px] text-[#92969d]`}>
              {count.toLocaleString("fa-IR")} محصول
              <span className="mx-2 text-[#d2d5d9]">•</span>
              صفحه {page.toLocaleString("fa-IR")} از{" "}
              {totalPages.toLocaleString("fa-IR")}
            </div>
          )}
        </div>

        {!loading && (
          <button
            type="button"
            onClick={retry}
            className="flex h-9 items-center gap-2 rounded-xl border border-[#e1e4e8] bg-white px-3.5 text-[11px] font-semibold text-[#686d75] transition hover:border-[#cfd3d9] hover:bg-[#f7f8f9] hover:text-[#202328]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
            </svg>
            بروزرسانی
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="text-xs font-semibold text-red-700">{error}</div>

          <button
            type="button"
            onClick={retry}
            disabled={loading}
            className="mt-3 h-9 rounded-lg bg-red-600 px-4 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#e6e8eb] bg-white"
            >
              <div className="aspect-square animate-pulse bg-[#f0f2f4]" />

              <div className="space-y-2.5 p-3">
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#eceef1]" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-[#f0f1f3]" />
                <div className="h-7 w-20 animate-pulse rounded-lg bg-[#f0f1f3]" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe2e6] bg-[#fafbfc] px-5 text-center">
          <div className="text-sm font-bold text-[#34383e]">
            محصولی پیدا نشد
          </div>

          <button
            type="button"
            onClick={retry}
            className="mt-4 h-9 rounded-xl border border-[#e1e4e8] bg-white px-4 text-[11px] font-semibold text-[#686d75] hover:bg-[#f7f8f9]"
          >
            دریافت مجدد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const image = getProductImage(product);
            const size = findProductSize(product);
            const selected = selectedProductId === product.id;

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                aria-pressed={selected}
                className={`group relative overflow-hidden rounded-2xl border bg-white text-right transition-all duration-200 ${
                  selected
                    ? "border-[#2563eb] shadow-[0_0_0_2px_rgba(37,99,235,.10),0_10px_25px_rgba(37,99,235,.10)]"
                    : "border-[#e4e7eb] shadow-[0_3px_12px_rgba(15,23,42,.035)] hover:-translate-y-0.5 hover:border-[#cdd2d8] hover:shadow-[0_10px_28px_rgba(15,23,42,.08)]"
                }`}
              >
                {selected && (
                  <div className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-md">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </div>
                )}

                <div
                  className={`aspect-square overflow-hidden border-b ${
                    selected
                      ? "border-[#dbe8ff] bg-[#f8fbff]"
                      : "border-[#eef0f2] bg-[#f8f9fa]"
                  }`}
                >
                  {image ? (
                    <img
                      key={`${page}-${product.id}-${image}`}
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        console.error(
                          "PRODUCT IMAGE LOAD ERROR:",
                          product.id,
                          product.name,
                          image
                        );
                        event.currentTarget.style.display = "none";
                      }}
                      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-[#a1a5ac]">
                      بدون تصویر
                    </div>
                  )}
                </div>

                <div className="p-3.5">
                  <div className="line-clamp-2 min-h-[40px] text-[13px] font-bold leading-5 text-[#292d32]">
                    {product.name}
                  </div>

                  {product.brand && (
                    <div className="mt-1 truncate text-[10px] font-medium text-[#9a9ea5]">
                      {product.brand.name}
                    </div>
                  )}

                  <div className="mt-3 flex min-h-7 items-center justify-between gap-2">
                    {size ? (
                      <div
                        dir="ltr"
                        className="inline-flex h-7 items-center rounded-lg bg-[#f3f5f7] px-2.5 text-[10px] font-semibold text-[#686d75]"
                      >
                        {size.widthCm} × {size.heightCm} cm
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#a0a4ab]">
                        ابعاد ثبت نشده
                      </div>
                    )}

                    {selected && (
                      <span className="text-[10px] font-bold text-[#2563eb]">
                        انتخاب شده
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && products.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col gap-3 border-t border-[#eceef1] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[10px] text-[#969ba3]">
            نمایش صفحه {page.toLocaleString("fa-IR")} از{" "}
            {totalPages.toLocaleString("fa-IR")}
          </div>

          <div dir="ltr" className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={!hasPrevious || page <= 1}
              onClick={() => loadProducts(page - 1)}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#e1e4e8] bg-white px-3 text-[11px] font-semibold text-[#646971] transition hover:bg-[#f7f8f9] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <span>‹</span>
              <span>قبلی</span>
            </button>

            {paginationItems.map((item) => {
              if (typeof item !== "number") {
                return (
                  <span
                    key={item}
                    className="flex h-9 w-8 items-center justify-center text-xs text-[#a0a4ab]"
                  >
                    …
                  </span>
                );
              }

              const active = item === page;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (!active) loadProducts(item);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-2 text-[11px] font-bold transition ${
                    active
                      ? "border-[#2563eb] bg-[#2563eb] text-white shadow-[0_4px_12px_rgba(37,99,235,.18)]"
                      : "border-[#e1e4e8] bg-white text-[#646971] hover:bg-[#f7f8f9]"
                  }`}
                >
                  {item.toLocaleString("fa-IR")}
                </button>
              );
            })}

            <button
              type="button"
              disabled={!hasNext || page >= totalPages}
              onClick={() => loadProducts(page + 1)}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#e1e4e8] bg-white px-3 text-[11px] font-semibold text-[#646971] transition hover:bg-[#f7f8f9] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <span>بعدی</span>
              <span>›</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
