import { ApiResponse } from "./api";

export interface Achivment {
    id: number;
    title: string;
    image: string;
    image_url: string;
    date: string;
    order: number;
}

interface AboutUsPageData {
    banner_image: string | null;
    banner_image_mobile: string | null;
    about_text_title: string;
    about_text: string;
    image: string | null;
    manager_image: string;
    manager_text_title: string;
    manager_text: string;
    video: string | null;
    content: string;
    achievements: Achivment[];
    slug: string;
    page_display_status: number;
    page_title: string;
    page_sub_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string | null;
    meta_tags: string[];
}

export type AboutUsPageResponse = ApiResponse<AboutUsPageData>;