import apiClient from './apiClient';
import { SettingsResponse } from '@/types/settings.types';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchSettingsData = async (): Promise<SettingsResponse> => {
    try {        
        const response = await apiClient.get<SettingsResponse>(`${API_BASE_URL}/setting/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Settings', error);
        throw error;
    }
};

export const sendNewsletter = async (data: {
    phone_number: string
}): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post<ApiResponse>(`${API_BASE_URL}/newsletter/create/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error sending data for newsletter:', error);
        throw error;
    }
};