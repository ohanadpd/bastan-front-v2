import * as React from 'react';
import { VideoPlayer } from '../ui/video-player';
import { cn, getMediaUrl } from '@/lib/utils';
import { Video } from '@/types/home.types';

export default function HomeVideoSection({ className, data }: { className?: string, data: Video }) {
    return (
        <section className={cn("container", className)}>
            <div className="flex flex-col xl:flex-row justify-center items-center gap-5">
                <div className="relative w-full max-w-[454px] h-[280px] bg-cover bg-center shrink-0 rounded-[5px] overflow-hidden" style={{backgroundImage: `url(${getMediaUrl(data?.thumbnail)})`}}>
                    <div className="absolute inset-0 flex justify-center items-center bg-black/50">
                        <VideoPlayer videoHtml={data.video_file} />
                    </div>
                </div>
                <div>
                    <h2 className="font-bold text-xl text-[#3B3B3B]">
                        {data.title}
                    </h2>
                    <p className="mt-[22px] text-[#3B3B3B]">
                        {data.description}
                    </p>
                </div>
            </div>
        </section>
    );
}