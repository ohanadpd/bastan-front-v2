import { ApiResponse, PaginatedResponse } from './api';

export interface Employment {
    id: number;
    job_title: string;
    image: string | null;
    description: string;
    tag: string[];
    city: string;
    created: Date;
    jcreated: string;
    updated: Date;
    jupdated: string;
    slug: string;
    page_display_status: number;
    page_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string | null;
    meta_tags: string[];
}

interface City {
    id: number;
    name: string;
}

interface EmploymentDetail {
    job_title: string;
    image: string | null;
    tag: string[];
    description: string;
    advantages: string;
    required_skills: string;
    position: Position[];
    city: string;
    content: string;
    slug: string;
    page_display_status: number;
    page_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string | null;
    meta_tags: string[];
    created: Date;
    jcreated: string;
    updated: Date;
    jupdated: string;
}

export interface Position {
    id: number;
    position: string;
}

export type employmentListResponse = ApiResponse<PaginatedResponse<Employment>>;
export type PositionResponse = ApiResponse<PaginatedResponse<Position>>;
export type EmploymentDetailResponse = ApiResponse<EmploymentDetail>;