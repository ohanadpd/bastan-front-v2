import { ApiResponse, PaginatedResponse } from './api';

export interface ArticleCatergoriesList {
    pk: number;
    name: string;
    description: string;
    slug: string;
}

export interface ArticleList {
    pk: number;
    slug: string;
    category: number;
    author: string;
    name: string;
    description: string;
    image: string;
    created: Date;
    jcreated: string;
    updated: Date
    jupdated: string;

}

interface ArticleDetails {
    pk: number;
    category: number;
    author: string;
    name: string;
    sub_title: string;
    image: string;
    banner: string | null;
    file: string;
    related_posts: ArticleList[];
    description: string;
    content: string;
    slug: string;
    page_display_status: number;
    page_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string;
    meta_tags: any[];
    created: Date;
    jcreated: string;
    updated: Date;
    jupdated: string;
}

export type ArticleCatergoriesListResponse = ApiResponse<PaginatedResponse<ArticleCatergoriesList>>;
export type ArticleListResponse = ApiResponse<PaginatedResponse<ArticleList>>;
export type ArticleDetailsResponse = ApiResponse<ArticleDetails>;