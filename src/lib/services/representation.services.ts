import apiClient from './apiClient';
import { RepresentationListResponse } from '@/types/representation.types';
import { PageDetailsResponse } from '@/types/page.type';

const API_BASE_URL = "";

export const fetchRepresentationList = async (search?: string, city?: number, province?: number, limit?: number, page?: number,): Promise<RepresentationListResponse> => {
    try {
        const response = await apiClient.get<RepresentationListResponse>(`${API_BASE_URL}/representation/all/`, {
            params: {
                search,
                limit,
                page,
                city,
                province
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Representation List', error);
        throw error;
    }
};

interface IndividualData {
    full_name: string;
    phone_number: string;
    email?: string;
    phone: string;
    national_code: string;
    province: string;
    city: string;
    desceription: string;
    postal_code: string;
}

export async function submitIndividualAgencyApplication(data: IndividualData) {
    try {
        // Send POST request
        const response = await apiClient.post(`${API_BASE_URL}/representation/create/real-person/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("form send:", response.data);
    } catch (error: any) {
        console.error("send form failed:", error.message);
    }
}

interface LegalData extends IndividualData {
    company_name: string;
    economic_code: string;
    national_company_code: string;
    position: string;
    activities: string;
}

export async function submitLegalEntityAgencyApplication(data: LegalData) {
    try {
        // Send POST request
        const response = await apiClient.post(`${API_BASE_URL}/representation/create/legal-person/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("form send:", response.data);
    } catch (error: any) {
        console.error("send form failed:", error.message);
    }
}

export const fetchGetRepresentationPageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/get-representation-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Representation Page Details:', error);
        throw error;
    }
};

export const fetchRepresentationPageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/representation-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Representation Page Details:', error);
        throw error;
    }
};