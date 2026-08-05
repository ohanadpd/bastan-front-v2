import { ApiResponse } from "./api";

interface ContactUsPageData {
    page_title: null | string;
    page_sub_title: null | string;
    banner_image: null | string;
    telegram_link: null | string;
    whatsapp_link: null | string;
    telegram_id: null | string;
    telegram_number: null | string;
    whatsapp_id: null | string;
    whatsapp_number : null | string;
    content: string;
    slug: string;
    page_description: string;
    page_keywords: string;
    canonical_link: null | string;
    meta_tags: [];
}

export interface ContactRequestBody {
    fullname: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
}


interface ApiErrorDetail {
    string: string;
    code: string;
}

interface ServerError {
    fullname?: ApiErrorDetail[];
    phone?: ApiErrorDetail[];
    email?: ApiErrorDetail[];
    subject?: ApiErrorDetail[];
    message?: ApiErrorDetail[];
}

export interface ContactUsApiResponse<T = any> extends ApiResponse<T> {
    parsedError?: ServerError; // optional field if you parse msg JSON
}

export type ContacttUsPageResponse = ApiResponse<ContactUsPageData>;