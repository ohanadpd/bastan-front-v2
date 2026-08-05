'use client';
import React from "react";
import Image from "next/image";
import { Trans } from "@lingui/react/macro";

interface DesignCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  title: string;
  dimensions: string | null | undefined;
  alt?: string;
}

const DesignCard: React.FC<DesignCardProps> = ({ 
  image, 
  title, 
  dimensions, 
  alt = "product",
  ...props
}) => {
  return (
    <div className="cursor-pointer group flex flex-col gap-4 p-1" {...props}>
      {image && <Image 
        src={image} 
        alt={alt} 
        width={500} 
        height={500} 
        className="w-full h-full object-cover aspect-square rounded-[5px] group-hover:outline outline-[1px] outline-primary" 
      />}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[#2A2A2A] group-hover:text-primary duration-300">
            {title}
        </h3>
        {dimensions && <span className="text-sm text-[#808080] group-hover:text-primary duration-300">
          {dimensions}
        </span>}
      </div>
    </div>
  );
};

export default DesignCard;
