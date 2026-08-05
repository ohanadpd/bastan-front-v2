import * as React from 'react';
import { VideoPlayer } from '../ui/video-player';
import { cn, getMediaUrl } from '@/lib/utils';

export default function HomeVideoSection2({ className, title, thumbnail, video }: { className?: string, title: string , thumbnail?: string, video?: string}) {
    return (
        <section className={cn("", className)}>
            <div className="relative w-full h-[414px] bg-cover bg-center overflow-hidden" style={{ backgroundImage : `url(${getMediaUrl(thumbnail)})` || ''}}>
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50">
                    <h2 className="text-white text-[28px] xl:text-[45.33px] font-extrabold">
                        {title}
                    </h2>
                    {video && <VideoPlayer videoHtml={video} />}
                </div>
            </div>
        </section>
    );
}