import { ApiResponse, PaginatedResponse } from './api';

export interface ICity {
    id: number;
    province: number;
    name: string;
}

export interface IProvince {
    id: number;
    name: string;
}



export type CityListResponse = ApiResponse<PaginatedResponse<ICity>>;
export type ProvinceListResponse = ApiResponse<PaginatedResponse<IProvince>>;