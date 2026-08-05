import { ApiResponse, PaginatedResponse } from "./api";

export interface Account {
    pk: number;
    confirm_profile: boolean;
    username: string | null;
    full_name: string;
    birthday: string | null;
    mobile_number: string;
    email: string | null;
    avatar: string | null;
    created: string;
    updated: string;
}


export interface Address {
    id: number;
    title: string;
    address: string;
    receiver_fullname: string;
    receiver_mobile_number: string;
    is_default: boolean
}

export interface RegisterAccount {
    access: string;
    refresh: string;
    user: {
        id: number;
        full_name: string;
        mobile_number: string;
    }
}

export type AccountResponse = ApiResponse<Account>;
export type RegisterAccountResponse = ApiResponse<RegisterAccount>;
export type AddressesListResponse = ApiResponse<PaginatedResponse<Address>>;