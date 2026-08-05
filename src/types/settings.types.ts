import { ApiResponse } from "./api";

interface Social {
    name: string,
    dark_icon: string,
    light_icon: string,
    link: string,
    username_or_id: string,
    display_section: string
}

export interface LinkCategory {
    id: number;
    title: string;
}

export interface LinkItem {
    id: number;
    category: LinkCategory;
    title: string;
    link: string;
}

export interface SettingsPageData {
    name: null | string;
    text: null | string;
    logo: null | string;
    logo_footer: null | string;
    favicon: null | string;
    slogan: null | string;
    copyright: null | string;
    phone: null | string;
    fax: null | string;
    email: null | string;
    mobile_number: null | string;
    map: null | string;
    longitude: null | string;
    latitude: null | string;
    zoom: null | string;
    website_link: null | string;
    socials: [] | Social[];
    adresses: null | string;
    links: LinkItem[];
}

export type SettingsResponse = ApiResponse<SettingsPageData>;