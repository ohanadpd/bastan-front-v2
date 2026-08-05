import apiClient from './apiClient';
import { ArticleCatergoriesListResponse, ArticleDetailsResponse, ArticleListResponse } from '@/types/articles.types';
import { PageDetailsResponse } from '@/types/page.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchArticleCategories = async (): Promise<ArticleCatergoriesListResponse> => {
    try {
        const response = await apiClient.get<ArticleCatergoriesListResponse>(`${API_BASE_URL}/article/category/list/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Article Categories:', error);
        throw error;
    }
};

export const fetchArticleList = async (page: number = 1, limit: number = 12, category?: string, ordering?: string): Promise<ArticleListResponse> => {
    try {
        const response = await apiClient.get<ArticleListResponse>(`${API_BASE_URL}/article/list/`,
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
        console.error('Error fetching Article List:', error);
        throw error;
    }
};

export const fetchArticlePageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/article-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Article Page Details:', error);
        throw error;
    }
};

export const fetchArticleDetails = async (id: string): Promise<ArticleDetailsResponse> => {
    try {
        const response = await apiClient.get<ArticleDetailsResponse>(`${API_BASE_URL}/article/detail/${id}`,{
            params: {
                id
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Article Details:', error);
        throw error;
    }
};

