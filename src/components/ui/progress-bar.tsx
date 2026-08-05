'use client'
import * as React from 'react';
import { ProgressProvider } from '@bprogress/next/app';

export default function ProgressComponent({ children }: { children: React.ReactNode }) {
    return (
        <ProgressProvider
            height="6px"
            color="var(--primary)"
            options={{ showSpinner: false }}
            shallowRouting
            // Pagination در عمل با تغییر query (مثل ?page=...) انجام می‌شود.
            // اگر library تغییر query را "همان URL" تشخیص دهد، با disableSameURL=true پروگرس استارت نمی‌شود.
            disableSameURL={false}
        >
            {children}
        </ProgressProvider>
    );
}