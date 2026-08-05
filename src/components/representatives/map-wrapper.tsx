'use client';
import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import AgenciesMapFilter from './map-filter';
import { Trans } from '@lingui/react/macro';
import { AgencyCard } from './agency-card';
import AllAgencyModal from './all-agency-modal';
import FilterAgencyModal from './filter-agency-modal';
import { Representation } from '@/types/representation.types';
// Lazy load the map component
const AgenciesMap = dynamic(() => import('./map'), { ssr: false });


export default function AgenciesMapWrapper({ className, initialData }: { className: string, initialData: Representation[] }) {
    const [selectedAgency, setSelectedAgency] = useState<{ center: [number, number], zoom: number }>({ center: [32.4279, 53.6880], zoom: 5 }); // Start with Yazd
    const [selectedId, setSelectedId] = useState<number>()
    const handleSelectAgency = (longitude: number, latitude: number, id?: number) => {
        setSelectedAgency({ center: [longitude, latitude], zoom: 16 });
        if(id)
            setSelectedId(id)
    }

    useEffect(() => {
        if (initialData[0]?.longitude && initialData[0]?.latitude)
            setSelectedAgency({ center: [initialData[0]?.longitude, initialData[0]?.latitude], zoom: 16 })
        if (initialData[0]?.pk)
            setSelectedId(initialData[0].pk)
    }, [initialData])

    return (
        <div className={cn('flex xl:flex-row flex-col xl:gap-5 gap-2 container xl:h-[941px] overflow-hidden', className)}>
            <div className='hidden xl:flex flex-col gap-9 w-[265px] shrink-0 h-full'>
                <div className='w-full border-[1px] border-[#A9A9A9] rounded-[10px] px-3 py-5'>
                    <h3 className='text-[#303030] font-bold text-center'>
                        <Trans>
                            جست و جو بین نمایندگان
                        </Trans>
                    </h3>
                    <AgenciesMapFilter />
                </div>
                <div className='w-full space-y-4 flex flex-col flex-1 min-h-0'>
                    <h3 className='text-[#303030] font-bold text-lg text-center'>
                        <Trans>
                            همه نمایندگی ها
                        </Trans>
                    </h3>
                    <div className='flex flex-col gap-4 overflow-y-auto flex-1 no-scrollbar'>
                        {initialData.map((agency) => (
                            <AgencyCard
                                key={agency.pk}
                                agency={agency}
                                onClick={() => handleSelectAgency(agency.longitude, agency.latitude, agency.pk)}
                                isActive={agency.pk === selectedId}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-full h-[619px] xl:h-[941px] p-6 border-[1px] border-[#A9A9A9] rounded-[10px] overflow-hidden'>
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-[#808080] text-sm">در حال بارگذاری نقشه...</p>
                        </div>
                    </div>
                }>
                    {
                        <AgenciesMap selectedAgency={selectedAgency} initialData={initialData} />}
                </Suspense>
            </div>
            <div className='flex flex-col gap-2 items-center xl:hidden'>
                <FilterAgencyModal />
                <AllAgencyModal agenciesData={initialData} 
                handleSelectAgency={(coordinates) => handleSelectAgency(coordinates[0], coordinates[1])} 
                selectedCard={selectedId}
                />

            </div>

        </div>
    );
}