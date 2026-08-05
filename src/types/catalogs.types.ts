import { ApiResponse, PaginatedResponse } from './api';

interface CatalogsList {
    id: number;
    name: string;
    download_url: string;
    image: null | string;
    created: Date;
}

export type CatalogsListResponse = ApiResponse<PaginatedResponse<CatalogsList>>;