import { HomePageResponse } from '@/types/home.types';
import apiClient from './apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchHomePage = async (): Promise<HomePageResponse> => {
    try {
        const response = await apiClient.get<HomePageResponse>(`${API_BASE_URL}/pages/home/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching HomePage:', error);
        throw error;
    }
};