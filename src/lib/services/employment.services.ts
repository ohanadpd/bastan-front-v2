import { EmploymentDetailResponse, employmentListResponse, PositionResponse } from "@/types/employment.types";
import apiClient from './apiClient';
import { PageDetailsResponse } from '@/types/page.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function sendResume(formData: any) {
    try {
        // Send POST request
        const response = await apiClient.post(`${API_BASE_URL}/employment/create/employment-resume/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("resume send:", response.data);
    } catch (error: any) {
        console.error("send resume failed:", error.message);
    }
}

export const fetchEmploymentList = async (page: number = 1, limit: number = 12, search?: string): Promise<employmentListResponse> => {
    try {
        const response = await apiClient.get<employmentListResponse>(`${API_BASE_URL}/employment/employments`,
            {
                params: {
                    page,
                    limit,
                    search
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Employment List:', error);
        throw error;
    }
};

export const fetchEmploymentDetails = async (id: string): Promise<EmploymentDetailResponse> => {
    try {
        const response = await apiClient.get<EmploymentDetailResponse>(`${API_BASE_URL}/employment/${id}`, {
            params: {
                id
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Employment Details:', error);
        throw error;
    }
};

export const fetchEmploymentPageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/employment-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Employment Page Details:', error);
        throw error;
    }
};

export const fetchPositions = async (): Promise<PositionResponse> => {
    try {
        const response = await apiClient.get<PositionResponse>(`${API_BASE_URL}/employment/employment-positions`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Positions:', error);
        throw error;
    }
};