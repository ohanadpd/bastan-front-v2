import apiClient from './apiClient';
import { ArticleCatergoriesListResponse, ArticleDetailsResponse, ArticleListResponse } from '@/types/articles.types';
import { PageDetailsResponse } from '@/types/page.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchNewsCategories = async (): Promise<ArticleCatergoriesListResponse> => {
    try {
        const response = await apiClient.get<ArticleCatergoriesListResponse>(`${API_BASE_URL}/news/category/list/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching News Categories:', error);
        throw error;
    }
};

export const fetchNewsList = async (page: number = 1, limit: number = 12, category?: string, ordering?: string): Promise<ArticleListResponse> => {
    try {
        const response = await apiClient.get<ArticleListResponse>(`${API_BASE_URL}/news/list/`,
            {
                params: {
                    page,
                    limit,
                    category,
                    ordering
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching News List:', error);
        throw error;
    }
};

export const fetchNewsPageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/news-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching News Page Details:', error);
        throw error;
    }
};

export const fetchNewsDetails = async (id: string): Promise<ArticleDetailsResponse> => {
    console.log(id)
    try {
        const response = await apiClient.get<ArticleDetailsResponse>(`${API_BASE_URL}/news/detail/${id}`,{
            params: {
                id
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching News Details:', error);
        throw error;
    }
};

