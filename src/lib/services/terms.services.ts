import { TermsPageResponse } from "@/types/terms.types";
import apiClient from './apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchTermsPage = async (): Promise<TermsPageResponse> => {
    try {
        const response = await apiClient.get<TermsPageResponse>(`${API_BASE_URL}/pages/terms-and-conditions/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Terms Page:', error);
        throw error;
    }
};
