import { ApiResponse } from "./api";

interface PageDetails {
    id: number;
    title: string;
    banner_image: string;
    banner_image_mobile:string
    sub_title: string;
    content: string;
    slug: string;
    page_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string;
    meta_tags: any[];
    text?: string;
}

export type PageDetailsResponse = ApiResponse<PageDetails>;