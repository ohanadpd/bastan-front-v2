'use client';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import { Button } from '../ui/button';
import { SearchNormal } from 'iconsax-reactjs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LoadingSpin from '../ui/loading-spin';
import { fetchCityList, fetchProvinceList } from '@/lib/services/area.services';
import { ICity, IProvince } from '@/types/area.types';
import { cn } from '@/lib/utils';

interface Filters {
    representative: string;
    province: string;
    city: string;
}

export default function AgenciesMapFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filters, setFilters] = React.useState<Filters>({
        representative: '',
        province: '',
        city: '',
    });
    const [isPending, startTransition] = useTransition();

    const [provinceList, setProvinceList] = useState<IProvince[]>()
    const [cityList, setCityList] = useState<ICity[]>()

    const handleChange = (filter: keyof Filters, value: string) => {
        setFilters({ ...filters, [filter]: value });
    }

    const handleApplyFilters = () => {
        applyFilters();
    }

    useEffect(() => {
        const representativeParams = searchParams.getAll('representative');
        const provinceParams = searchParams.getAll('province');
        const cityParams = searchParams.getAll('city');
        setFilters({
            representative: representativeParams[0],
            province: provinceParams[0],
            city: cityParams[0]
        });
    }, [searchParams]);


    useEffect(() => {
        const getCities = async () => {
            if (filters?.province) {
                const cityRes = await fetchCityList(Number(filters.province), 1, 100);
                setCityList(cityRes.data.results);
            } else {
                setCityList([]);
            }
        };

        getCities();
    }, [filters?.province]);

    useEffect(() => {
        fetchProvinceList(1, 32).then((res) => setProvinceList(res.data.results));
    }, []);

    // Apply filters to URL
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        // Clear existing category parameters
        params.delete('representative');
        params.delete('province');
        params.delete('city');

        // Add new category parameters
        if (filters.representative) {
            params.append('representative', filters.representative);
        }
        if (filters.province) {
            params.append('province', filters.province);
        }
        if (filters.city) {
            params.append('city', filters.city);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <>
            <div className='flex flex-col gap-4 mt-[26px]'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="agency-name" className='font-semibold text-[#454545]'>
                        <Trans>
                            نام نماینده
                        </Trans>:
                    </label>
                    <input type="text" id="agency-name" className='w-full h-12 border-[1px] border-[#A9A9A9] rounded-[5px] px-3' defaultValue={filters.representative} onChange={(e) => handleChange('representative', e.target.value)} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="agency-name" className='font-semibold text-[#454545]'>
                        <Trans>
                            استان
                        </Trans>:
                    </label>
                    <Select onValueChange={(value) => handleChange('province', value)} value={filters.province || ''}>
                        <SelectTrigger className="w-full !h-12 border-[1px] border-[#A9A9A9] rounded-[5px] px-3">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                            {provinceList?.map((item, index) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className={cn('flex flex-col gap-2', filters.province ? '' : 'cursor-not-allowed [&>*]:!cursor-not-allowed')}>
                    <label htmlFor="agency-name" className='font-semibold text-[#9E9E9E]'>
                        <Trans>
                            شهر
                        </Trans>:
                    </label>
                    <Select onValueChange={(value) => handleChange('city', value)} value={filters.city || ''} disabled={cityList && !filters.province}>
                        <SelectTrigger className="w-full !h-12 border-[1px] border-[#A9A9A9] rounded-[5px] px-3">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                            {cityList?.map((item, index) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button onClick={handleApplyFilters} className='flex items-center justify-center gap-2 mt-9 text-lg w-full max-w-[162px] mx-auto h-12'>
                {isPending ? (
                    <span className='flex items-center justify-center'>
                        <LoadingSpin />
                    </span>
                ) : (
                    <>
                        <Trans>
                            جست و جو
                        </Trans>
                        <SearchNormal className='size-5' variant='Bold' color='#fff' />
                    </>
                )}
            </Button>
        </>
    );
}