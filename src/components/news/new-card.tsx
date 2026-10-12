import { cn, getMediaUrl } from "@/lib/utils";
import { ArrowRight } from "iconsax-reactjs";
import * as React from "react";
import Image from "next/image";

type NewCardProps = React.ComponentPropsWithoutRef<"div"> & {
  image: string;
  title: string;
  description: string;
};

const NewCard = React.forwardRef<HTMLDivElement, NewCardProps>(
  ({ image, title, description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "group relative min-h-[245px] overflow-hidden rounded-[5px] bg-[#F2F2F2]",
          className,
        )}
      >
        {image && (
          <Image
            src={getMediaUrl(image)}
            alt={title}
            fill
            sizes="(min-width: 1280px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-x-[10px] bottom-[12px] flex h-[40px] items-center justify-between gap-3 rounded-full bg-white px-3">
          <h3 className="min-w-0 truncate text-[14px] font-semibold text-[#353535]">
            {title}
          </h3>

          <span
            aria-hidden="true"
            className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-[#820008]"
          >
            <ArrowRight
              size={20}
              color="#ffffff"
              className="-rotate-45"
            />
          </span>
        </div>
      </div>
    );
  },
);

NewCard.displayName = "NewCard";

export { NewCard };