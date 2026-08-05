'use client'
import * as React from 'react';
import Image from 'next/image';
import { useLayoutEffect } from 'react';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({children}: AuthWrapperProps) {
    useLayoutEffect(() => {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }
        return () => {
            if (footer) {
                footer.style.display = 'block';
            }
        };
    }, []);
    return (
        <main className='h-screen flex'>
            <div className='container xl:w-1/2 w-full flex flex-col justify-center items-center'>
                {children}
            </div>
            <div className='relative hidden xl:block xl:w-1/2'>
                <Image src="/images/auth/auth-bg.jpg" alt="auth-bg" fill className='object-cover' />
            </div>
        </main>
    );
}