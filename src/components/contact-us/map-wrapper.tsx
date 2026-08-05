'use client';
import * as React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Representation } from '@/types/representation.types';
// Lazy load the map component
const AgenciesMap = dynamic(() => import('../representatives/map'), { ssr: false });

export default function ContactUsMapWrapper({ className, longitude, latitude }: { className?: string, longitude: string, latitude: string }) {
    const initialData = [{
        pk: 0,
        slug: "",
        province: { id: 0, name: "" },
        city: { id: 0, province: 0, name: "" },
        name: "",
        manager_first_name: "",
        image: "",
        address: "",
        phone_number: "",
        email: "",
        longitude: Number(longitude),
        latitude: Number(latitude),
    }] as Representation[]
    
    return (
        <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-[#808080] text-sm">در حال بارگذاری نقشه...</p>
                </div>
            </div>
        }>
            <AgenciesMap initialData={initialData} selectedAgency={{center: [Number(longitude), Number(latitude)], zoom: 16}} />
        </Suspense>
    );
}