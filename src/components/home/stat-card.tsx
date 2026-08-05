import * as React from 'react';

export default function StatCard({ title, value }: { title: string, value: string }) {
    return (

        <div className="flex flex-col gap-4 items-center justify-center w-full xl:w-[265px] h-[168px] bg-[#EEEEEE] rounded-[5px]">
            <span dir='ltr' className="font-bold text-[34px] ">
                {value}
            </span>
            <span className="text-lg text-[#616161] text-center">
                {title}
            </span>
        </div>
    );
}