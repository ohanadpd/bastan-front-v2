'use client';
import React, { useState, useCallback, useEffect } from 'react';
import jalaali from 'jalaali-js';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
interface JalaliDateInputProps {
    onDateChange: (date: string) => void;
    value?: string;
}

const JalaliDateInput: React.FC<JalaliDateInputProps> = ({ onDateChange, value }) => {
    const { i18n } = useLingui();
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    // محاسبه سال جاری بر اساس تقویم جلالی
    const currentJalaliYear = jalaali.toJalaali(new Date()).jy;

    // تنظیم محدوده سال‌ها برای اطمینان از حداقل سن ۱۲ سال
    const yearOptions = Array.from({ length: 100 }, (_, i) => {
        const year = currentJalaliYear - i;
        return year <= currentJalaliYear - 12 ? year : null; // تصحیح شرط برای فیلتر کردن سال‌های مجاز
    }).filter(Boolean);

    // eslint-disable-next-line
    useEffect(() => {
        if (value && !day && !month && !year) {
            const [gy, gm, gd] = value.split('-').map(Number);
            const jalaliDate = jalaali.toJalaali(gy, gm, gd);
            setDay(String(jalaliDate.jd));
            setMonth(String(jalaliDate.jm));
            setYear(String(jalaliDate.jy));
        }
    });

    useEffect(() => {
        // Only call handleDateChange if all values are present
        if (day && month && year) {
            handleDateChange();
        }
    // eslint-disable-next-line
    }, [day, month, year]); // Remove handleDateChange from dependencies

    const handleDateChange = useCallback(() => {
        if (day && month && year) {
            const intYear = parseInt(year, 10);
            const intMonth = parseInt(month, 10);
            const intDay = parseInt(day, 10);

            const { gd, gm, gy } = jalaali.toGregorian(intYear, intMonth, intDay);
            const formattedDate = `${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}`;
            onDateChange(formattedDate);
        }
    }, [day, month, year, onDateChange]);

    return (
        <div className='flex gap-1 md:gap-2 xl:gap-5'>
            <Select
                value={day}
                name="birthDay"
                onValueChange={(value) => { setDay(value) }}
            >
                <SelectTrigger className="w-full !h-12 border-[1px] border-[#D3D3D3] rounded-[5px] px-3">
                    <SelectValue className="text-grayText" placeholder={i18n._(msg`روز`)} />
                </SelectTrigger>
                <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                    {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                name="birthMonth"
                onValueChange={(value) => { setMonth(value) }}
                value={month}
            >
                <SelectTrigger className="w-full !h-12 border-[1px] border-[#D3D3D3] rounded-[5px] px-3">
                    <SelectValue className="text-grayText" placeholder={i18n._(msg`ماه`)} />
                </SelectTrigger>
                <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                    <SelectItem value="1">فروردین</SelectItem>
                    <SelectItem value="2">اردیبهشت</SelectItem>
                    <SelectItem value="3">خرداد</SelectItem>
                    <SelectItem value="4">تیر</SelectItem>
                    <SelectItem value="5">مرداد</SelectItem>
                    <SelectItem value="6">شهریور</SelectItem>
                    <SelectItem value="7">مهر</SelectItem>
                    <SelectItem value="8">آبان</SelectItem>
                    <SelectItem value="9">آذر</SelectItem>
                    <SelectItem value="10">دی</SelectItem>
                    <SelectItem value="11">بهمن</SelectItem>
                    <SelectItem value="12">اسفند</SelectItem>
                </SelectContent>
            </Select>
            <Select
                name="birthYear"
                onValueChange={(value) => { setYear(value) }}
                value={year}
            >
                <SelectTrigger className="w-full !h-12 border-[1px] border-[#D3D3D3] rounded-[5px] px-3">
                    <SelectValue className="text-grayText" placeholder={i18n._(msg`سال`)} />
                </SelectTrigger>
                <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                    {yearOptions.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default JalaliDateInput;