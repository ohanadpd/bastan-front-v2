import { ApiResponse } from "./api";

export interface FAQ {
    id: number;
    title: string;
    text: string;
}

export interface TermsPageData {
    faq: FAQ[];
}

export type TermsPageResponse = ApiResponse<TermsPageData>;