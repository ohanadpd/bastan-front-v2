import apiClient from './apiClient';
import { AboutUsPageResponse } from '@/types/about-us.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchAboutUsPage = async (): Promise<AboutUsPageResponse> => {
    try {
        const response = await apiClient.get<AboutUsPageResponse>(`${API_BASE_URL}/pages/about-us/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching AboutUsPage:', error);
        throw error;
    }
};