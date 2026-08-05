import { ApiResponse, PaginatedResponse } from './api';

interface Unit {
    id: number;
    name: string;
}

// New product 
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    image: string;
    icon: string;
    image_thumbnail: string;
    icon_thumbnail: string;
    parent: number | null;
    children: Category[];
    products_count: number;
    created: string; // ISO datetime
    updated: string; // ISO datetime
}

export interface Brand {
    id: number;
    name: string;
    image: string | null;
    website: string | null;
}

export interface Badge {
    id: number;
    name: string;
    badge_color: string;
    text_color: string;
}

export interface AttributeValue {
    id: number;
    value: string | null;
    attribute_name: string;
    display_priority: number;
}

export interface Variant {
    id: number;
    sku: string | null;
    variant_name: string;
    variant_type: number;
    reference_code: string | null;
    price: number;
    dollar_price: number;
    buying_price: number;
    in_stock: boolean;
    stock_quantity: number;
    sales: number | null;
    default: boolean;
    image: string | null;
    attribute_values: AttributeValue[];
    created: string;
    updated: string;
    discount: number;
    tax: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    extra_detail: string;
    category: Category[];
    brand: Brand | null;
    badge: Badge[];
    unit: Unit | null;
    image: string;
    banner: string | null;
    image_thumbnail: string;
    variants_count: number;
    variants: Variant[];
    min_price: number;
    max_price: number;
    in_stock: boolean;
    created: string;
    updated: string;
}

export interface RelatedProduct {
    id: number;
    description?: string;
    image: string;
    name: string;
    slug: string;
}
export interface Gallery {
    id: 2,
    image: string;
    image_thumbnail: string;
    title: string;
    description: string;
    created: Date
}

export interface ProductDetail extends Product {
    description: string;
    extra_detail: string;
    page_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string;
    meta_tags: any[]
    related_products: RelatedProduct[];
    related_faces: RelatedProduct[];
    gallery: Gallery[];
    content: string;
    type: string;
    variants: Variant[];
}


interface TestProductDetail {
    data: ProductDetail
}

export interface CartList {
    id: number;
    user: number;
    is_active: boolean;
    items: CartItem[];
    total_price: number;
}

export interface CartItem {
    id: number;
    variant: Variant;
    quantity: number;
    subtotal: number;
    name: string;
}

export interface Order {
    id: number;
    get_total_amount: number;
    status: number;
    items: OrderItem[];
    order_description: string;
    pay_after: boolean;
    address_title: string | null;
    created: Date,
    updated: Date,
    payment_method: string[][]
}

export interface OrderDetail extends Order {
    address: {
        id: number;
        title: string;
        address: string;
        receiver_fullname: string;
        receiver_mobile_number: string;
    }
    discount: number;
    delivery_method: {
        id: number;
        title: string;
        description: string;
        delivery_price: number;
    },
}

interface OrderItem {
    variant: Variant;
    quantity: number;
    get_price: number;
    get_tax: number;
    product: string;
    unit: string;
}

export interface DeliveryMethods {
    id: number;
    title: string;
    description: string;
    delivery_price: number;
}

export interface DiscountData {
    success: boolean;
    discount_percentage: number;
}

export interface PaymentData {
    id: 1;
    status: string;
    order: number;
    amount: number;
    order_payed_status: boolean;
    order_tracking_code: string;
}

export interface CheckoutData {
    order: Order;
    payment: {
        status: boolean;
        gateway_link: string;
        pre_payment: {
            id: number;
            amount: number;
            tracking_code: number;
            user_id: number;
        },
        bank: {
            name: string;
        }
    }
}

export type ProductCatergoriesListResponse = ApiResponse<PaginatedResponse<Category>>;
export type ProductBrandListResponse = ApiResponse<PaginatedResponse<Brand>>;
export type ProductListResponse = ApiResponse<PaginatedResponse<Product>>;
export type ProductDetailsResponse = ApiResponse<ProductDetail>;
export type CartListResponse = ApiResponse<CartList>;
export type OrderListResponse = ApiResponse<PaginatedResponse<Order>>;
export type OrderDetailResponse = ApiResponse<OrderDetail>;
export type DeliveryMethodsResponse = ApiResponse<PaginatedResponse<DeliveryMethods>>;
export type DiscountDataResponse = ApiResponse<DiscountData>;
export type PaymentDataResponse = ApiResponse<PaymentData>;
export type CheckoutDataResponse = ApiResponse<CheckoutData>;
export type AttributeValuesResponse = ApiResponse<PaginatedResponse<AttributeValue>>;