import { ApiResponse } from '@/types/api';
import apiClient from './apiClient';
import { PageDetailsResponse } from '@/types/page.type';
import { ProductBrandListResponse, ProductCatergoriesListResponse, ProductDetailsResponse, ProductListResponse, CartListResponse, CartItem, OrderListResponse, DeliveryMethodsResponse, DiscountDataResponse, OrderDetailResponse, AttributeValuesResponse, PaymentDataResponse, CheckoutDataResponse } from '@/types/products.types';

const API_BASE_URL = "";

export const fetchProductCategories = async (): Promise<ProductCatergoriesListResponse> => {
    try {
        const response = await apiClient.get<ProductCatergoriesListResponse>(`${API_BASE_URL}/products/categories/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Product Categories:', error);
        throw error;
    }
};

export const fetchProductBrands = async (): Promise<ProductBrandListResponse> => {
    try {
        const response = await apiClient.get<ProductBrandListResponse>(`${API_BASE_URL}/products/brands/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Product Brands:', error);
        throw error;
    }
};

interface FetchProductListParams {
    page?: number;
    limit?: number;
    brand?: string[] | string;
    attribute_value?: string[] | string;
    category?: string[] | string;
    price_max?: string;
    price_min?: string;
    size?: string;
}

export const fetchProductList = async ({
    page = 1,
    limit = 12,
    brand,
    attribute_value,
    category,
    price_max,
    price_min,
    size,
}: FetchProductListParams): Promise<ProductListResponse> => {
    try {
        const response = await apiClient.get<ProductListResponse>(`${API_BASE_URL}/products/search/`,
            {
                params: {
                    page,
                    limit,
                    brand,
                    attribute_value,
                    category,
                    price_max,
                    price_min,
                    size,
                },
                paramsSerializer: {
                    indexes: null,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Product List:', error);
        throw error;
    }
};

export const fetchProductPageDetails = async (): Promise<PageDetailsResponse> => {
    try {
        const response = await apiClient.get<PageDetailsResponse>(`${API_BASE_URL}/pages/product-page/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Product Page Details:', error);
        throw error;
    }
};

export const fetchProductDetails = async (
  id: string
): Promise<ProductDetailsResponse> => {
  try {
    const response = await apiClient.get<ProductDetailsResponse>(
      `/products/products/${id}/`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching Product Details:", error);
    throw error;
  }
};


interface CartRequestBody {
    variant_id: number;
    quantity: number;
}

export const addToCart = async (
    body: CartRequestBody
): Promise<ApiResponse> => {
    try {
        const { data } = await apiClient.post<ApiResponse>(
            `${API_BASE_URL}/products/cart/add/`,
            body
        );
        return data;
    } catch (error: any) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};


export const fetchCartList = async (): Promise<CartListResponse> => {
    try {
        const response = await apiClient.get<CartListResponse>(`${API_BASE_URL}/products/cart/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Cart List:', error);
        throw error;
    }
};

export const deleteCartItem = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await apiClient.delete<ApiResponse>(`${API_BASE_URL}/products/cart/delete/${id}/`);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting Cart Item:', error);
        throw error;
    }
};

export const updateCartItem = async (id: number, body: CartRequestBody): Promise<ApiResponse<CartItem>> => {
    try {
        const response = await apiClient.patch<ApiResponse<CartItem>>(`${API_BASE_URL}/products/cart/update/${id}/`, body);
        return response.data;
    } catch (error: any) {
        console.error('Error updating Cart Item:', error);
        throw error;
    }
};

export const fetchOrderList = async ({
    page = 1,
    limit = 12,
}: { page?: number, limit?: number }): Promise<OrderListResponse> => {
    try {
        const response = await apiClient.get<OrderListResponse>(`${API_BASE_URL}/products/orders/`,
            {
                params: {
                    page,
                    limit,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Order List:', error);
        throw error;
    }
};

export const fetchOrderDetail = async (id: string): Promise<OrderDetailResponse> => {
    try {
        const response = await apiClient.get<OrderDetailResponse>(`${API_BASE_URL}/products/orders/${id}/`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Order Detail:', error);
        throw error;
    }
};

export const fetchDeliveryMethods = async ({
    page = 1,
    limit = 12,
}): Promise<DeliveryMethodsResponse> => {
    try {
        const response = await apiClient.get<DeliveryMethodsResponse>(`${API_BASE_URL}/products/delivery/`,
            {
                params: {
                    page,
                    limit,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error Delivery Methods List:', error);
        throw error;
    }
};

export const verifyDiscountCode = async (code: string): Promise<DiscountDataResponse> => {
    try {
        const response = await apiClient.get<DiscountDataResponse>(`${API_BASE_URL}/products/verify-discount-code/${code}/`);
        return response.data;
    } catch (error: any) {
        console.error('Error Verifying Discount Code:', error);
        throw error;
    }
};


interface FetchAttributeValuesParams {
    page?: number;
    limit?: number;
    attribute__filter_display?: boolean;
}

export const fetchAttributeValues = async ({
    page = 1,
    limit = 12,
    attribute__filter_display
}: FetchAttributeValuesParams): Promise<AttributeValuesResponse> => {
    try {
        const response = await apiClient.get<AttributeValuesResponse>(`${API_BASE_URL}/products/attribute-values/`,
            {
                params: {
                    page,
                    limit,
                    attribute__filter_display,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching Attribute List:', error);
        throw error;
    }
};


export const verifyPayment = async (code: string): Promise<PaymentDataResponse> => {
    try {
        const response = await apiClient.get<PaymentDataResponse>(`${API_BASE_URL}/payment/verify-payment/${code}/`);
        return response.data;
    } catch (error: any) {
        console.error('Error Verifying Payment:', error);
        throw error;
    }
};

interface CheckOutBody {
    order_description: string;
    address_id: string;
    delivery_method: string;
    discount_code: string;
}

export const checkOut = async (
    body: CheckOutBody
): Promise<CheckoutDataResponse> => {
    try {
        const { data } = await apiClient.post<CheckoutDataResponse>(
            `${API_BASE_URL}/products/checkout/`,
            body
        );
        return data;
    } catch (error: any) {
        console.error('Error checkout:', error);
        throw error;
    }
};