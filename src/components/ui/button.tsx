import { cn } from "@/lib/utils";
import * as React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "solid" | "outline";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex h-12 min-w-[179px]
      items-center justify-center gap-2 px-6
      rounded-[10px] border-2 border-primary
      text-[18px] font-normal
      transition-colors duration-200
      focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-primary
      focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
    `;

    const variants = {
      solid: `
        bg-primary text-white
        hover:bg-[#820008] hover:border-[#820008]
      `,
      outline: `
        bg-white text-primary
        hover:bg-primary hover:text-white
      `,
    };

    return (
      <button
        ref={ref}
        type={type}
        {...props}
        className={cn(baseStyles, variants[variant], className)}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };