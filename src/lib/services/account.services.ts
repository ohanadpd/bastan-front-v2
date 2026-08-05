import { ApiResponse } from '@/types/api';
import { AccountResponse, AddressesListResponse, Address, RegisterAccountResponse } from '@/types/accounts.types';
import apiClient from './apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchProfile = async (): Promise<AccountResponse> => {
    try {
        const response = await apiClient.get<AccountResponse>(`${API_BASE_URL}/account/profile/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateProfile = async (data: {
    username: string;
    full_name: string;
    email: string;
}): Promise<AccountResponse> => {
    try {
        const response = await apiClient.patch<AccountResponse>(`${API_BASE_URL}/account/update-profile/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const changePassword = async (data: {
    old_password: string;
    new_password: string;
}): Promise<ApiResponse> => {
    try {
        const response = await apiClient.put<ApiResponse>(`${API_BASE_URL}/account/change-password/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating passowrd:', error);
        throw error;
    }
};



export const createAddress = async (data: {
    title: string;
    address: string;
    receiver_fullname: string;
    receiver_mobile_number: string;
    is_default: boolean;
}): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post<ApiResponse>(`${API_BASE_URL}/account/addresses/create/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating address:', error);
        throw error;
    }
};

export const updateAddress = async (id: number, data: {
    title: string;
    address: string;
    receiver_fullname: string;
    receiver_mobile_number: string;
    is_default: boolean;
}): Promise<ApiResponse> => {
    try {
        const response = await apiClient.patch<ApiResponse>(`${API_BASE_URL}/account/addresses/${id}/update/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating address:', error);
        throw error;
    }
};

export const fetchAddresses = async (page: number = 1, limit: number = 12): Promise<AddressesListResponse> => {
    try {
        const response = await apiClient.get<AddressesListResponse>(`${API_BASE_URL}/account/addresses/`,
            {
                params: {
                    page,
                    limit
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Addresses:', error);
        throw error;
    }
};

export const fetchAddress = async (id: number | string): Promise<ApiResponse<Address>> => {
    try {
        const response = await apiClient.get<ApiResponse<Address>>(`${API_BASE_URL}/account/addresses/${id}/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const deleteAddress = async (id: number | string): Promise<ApiResponse> => {
    try {
        const response = await apiClient.patch<ApiResponse>(`${API_BASE_URL}/account/addresses/${id}/delete/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}


export const sendOtp = async (data: {
    mobile_number: string;
    type: 1 | 2; //1 for forget pass and 2 for register new user
}): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post<ApiResponse>(`${API_BASE_URL}/account/otp/send/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error sending otp code:', error);
        throw error;
    }
};

interface verifyOtpRes {
    token: string
}

export const verifyOtp = async (data: {
    mobile_number: string;
    code: number | string;
}): Promise<ApiResponse<verifyOtpRes>> => {
    try {
        const response = await apiClient.post<ApiResponse<verifyOtpRes>>(`${API_BASE_URL}/account/otp/verify/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error verifying otp code:', error);
        throw error;
    }
};

export const forgotPassword = async (data: {
    token: string;
    new_password: string;
}): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post<ApiResponse>(`${API_BASE_URL}/account/forgot-password/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error changing password:', error);
        throw error;
    }
};

export const registerAccount = async (data: {
    mobile_number: string;
    full_name: string;
    token: string;
    password: string;
}): Promise<RegisterAccountResponse> => {
    try {
        const response = await apiClient.post<RegisterAccountResponse>(`${API_BASE_URL}/account/register-complete/`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating account:', error);
        throw error;
    }
};
