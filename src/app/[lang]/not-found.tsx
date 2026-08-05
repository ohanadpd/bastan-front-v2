import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'صفحه مورد نظر پیدا نشد!',
};

export default function NotFound() {
    return (
        <main className='container min-h-screen flex flex-col justify-center items-center gap-4'>
            <h1 className='text-center text-[60.51px] xl:text-[82.4px] font-extrabold text-primary'>
                404
            </h1>
            <p className='text-center text-[#231F20] text-lg xl:text-xl'>
                <Trans>
                    صفحه مورد نظر پیدا نشد!
                </Trans>
            </p>
        </main>
    );
}