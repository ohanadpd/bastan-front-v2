import { cn } from '@/lib/utils';
import * as React from 'react';

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
  variant?: 'solid' | 'outline';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', ...props }, ref) => {
    const baseStyles =
      'h-12 min-w-[179px] font-semibold transition-all duration-300 rounded-[5px]';

    const variants = {
      solid: 'bg-primary text-white hover:bg-primary-dark',
      outline:
        'border-[1px] border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    };

    return (
      <button
        ref={ref}
        {...props}
        className={cn(baseStyles, variants[variant], className)}
      >
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
