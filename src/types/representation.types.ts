import { ApiResponse, PaginatedResponse } from './api';
import { ICity, IProvince } from './area.types';

export interface Representation {
    pk: number;
    slug: string;
    province: IProvince;
    city: ICity;
    name: string;
    manager_first_name: string;
    image: string;
    address: string;
    phone_number: string;
    email: string;
    longitude: number;
    latitude: number;
}

export type RepresentationListResponse = ApiResponse<PaginatedResponse<Representation>>;