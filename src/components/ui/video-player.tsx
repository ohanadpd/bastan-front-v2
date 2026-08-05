"use client";

import React, { useState } from "react";
import { PlayButton } from "./play-button";

interface VideoPlayerProps {
    videoHtml: string;
}

export function VideoPlayer({ videoHtml }: VideoPlayerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openVideo = () => setIsOpen(true);
    const closeVideo = () => setIsOpen(false);

    return (
        <>
            <span onClick={openVideo} className="cursor-pointer">
                <PlayButton />
            </span>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeVideo}>
                    <div className="relative bg-white rounded-lg p-1 w-[90vw] max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute -top-10 right-0 text-white text-xl font-bold p-2"
                            onClick={closeVideo}
                        >
                            ✕
                        </button>
                        <div className="video-container" dangerouslySetInnerHTML={{ __html: videoHtml }} />
                    </div>
                </div>
            )}
        </>
    );
}