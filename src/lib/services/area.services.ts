import apiClient from './apiClient';
import { CityListResponse, ProvinceListResponse } from '@/types/area.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchCityList = async (province?: number, page?: number, limit?: number, ordering?: string): Promise<CityListResponse> => {
    try {
        const response = await apiClient.get<CityListResponse>(`${API_BASE_URL}/area/city/list/`,
            {
                params: {
                    page,
                    limit,
                    ordering,
                    province
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Cities List:', error);
        throw error;
    }
};

export const fetchProvinceList = async (page?: number, limit?: number, ordering?: string): Promise<ProvinceListResponse> => {
    try {
        const response = await apiClient.get<ProvinceListResponse>(`${API_BASE_URL}/area/province/list/`,
            {
                params: {
                    page,
                    limit,
                    ordering
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Provinces List:', error);
        throw error;
    }
}