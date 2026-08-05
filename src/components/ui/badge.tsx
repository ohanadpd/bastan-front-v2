
import { cn } from '@/lib/utils';
import * as React from 'react';

type BadgeProps = React.ComponentPropsWithRef<'span'>;

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, ...props }, ref) => {
        return (
            <span ref={ref} {...props} className={cn('flex justify-center items-center bg-primary-light text-xs text-[#341B14] rounded-full px-3 min-w-[61px] h-[26px]', className)}>
                {props.children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
export { Badge };
