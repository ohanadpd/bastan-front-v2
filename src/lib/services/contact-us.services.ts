import apiClient from './apiClient';
import { ContactRequestBody, ContacttUsPageResponse } from '@/types/contact-us.types';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchContactUsPage = async (): Promise<ContacttUsPageResponse> => {
    try {
        const response = await apiClient.get<ContacttUsPageResponse>(`${API_BASE_URL}/pages/contact-us/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching ContactUsPage:', error);
        throw error;
    }
};

export const sendContactForm = async (
    body: ContactRequestBody
): Promise<ApiResponse<null>> => {
    try {
        const { data } = await apiClient.post<ApiResponse<null>>(
            `${API_BASE_URL}/contact-us/submit-message/`,
            body
        );
        return data;
    } catch (error: any) {
        console.error('Error fetching ContactUsPage:', error);
        throw error;
    }
};