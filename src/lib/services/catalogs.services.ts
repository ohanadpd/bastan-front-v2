import apiClient from './apiClient';
import { CatalogsListResponse } from '@/types/catalogs.types';
import { PageDetailsResponse } from '@/types/page.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchCatalogsList = async (page: number = 1, limit: number = 12): Promise<CatalogsListResponse> => {
    try {
        const response = await apiClient.get<CatalogsListResponse>(`${API_BASE_URL}/products/catalogs/`,
            {
                params: {
                    page,
                    limit,
                },
            });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Catalogs:', error);
        throw error;
    }
};

/** Server-safe: whether any catalogs exist (used by layout/nav before paint). */
export async function hasCatalogs(): Promise<boolean> {
    try {
        const res = await fetchCatalogsList(1, 1);
        return (res.data?.results?.length ?? 0) > 0;
    } catch {
        return false;
    }
}

export const fetchCatalogsPageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/catalog-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Catalogs Page Details:', error);
        throw error;
    }
};
