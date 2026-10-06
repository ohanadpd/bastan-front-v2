import * as React from "react";
import Image from "next/image";
import { cn, getMediaUrl } from "@/lib/utils";
import { ShoppingCart } from "iconsax-reactjs";
import type { Badge as IBadge } from "@/types/products.types";
import { Badge } from "./badge";

const isShoppingMode =
  process.env.NEXT_PUBLIC_IS_SHOPPING_MODE === "true";

type ProductCardProps = {
  className?: string;
  title?: string;
  description?: string;
  badges?: IBadge[];
  image?: string;
};

export default function ProductCard({
  className,
  title,
  description,
  badges,
  image,
}: ProductCardProps) {
  return (
    <div className={cn("group", className)}>
      <div className="relative h-[203px] w-full overflow-hidden rounded-t-[5px] xl:w-auto">
        {image && (
          <Image
            src={getMediaUrl(image)}
            alt={title || "محصول"}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div
        className="
          mt-2 flex flex-col gap-2 rounded-b-[5px] bg-white p-3
          group-hover:shadow-[inset_0_0_0_0.6px_var(--primary)]
        "
      >
        <h3 className="text-sm font-semibold text-[#252525] transition-all duration-300 group-hover:text-primary">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm text-[#5C5C5C]">
          {description}
        </p>

        <div className="flex justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {badges?.map((item) => (
              <Badge key={item.id}>{item.name}</Badge>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
}