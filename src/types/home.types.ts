import { ApiResponse } from "./api";
import { ArticleList } from "./articles.types";
import { Product } from "./products.types";

export interface HeaderGallery {
    id: number;
    title: string | null;
    link: string | null;
    image: string;
    alt: string | null;
    publish: boolean;
}

export interface IntroductionText {
    id: number;
    title: string;
    content: string;
    publish: boolean;
}

interface Logo {
    image: string;
}

export interface Video {
    title: string;
    description: string;
    video_file: string;
    thumbnail: string;
}

interface ProductSection {
    id: number;
    title: string;
    description: string;
    background_color: string;
    background_image: string | null;
    publish: boolean;
    cards: ProductCard[];
}

export interface ProductCard {
    id: number;
    product: Product;
    year: string;
    order: number;
    publish: boolean;
}

interface Year {
    id: number;
    year: number;
}

interface NewsSection {
    id: number;
    title: string;
    description: string;
    background_color: string;
    background_image: string | null;
    publish: boolean;
    cards: NewsCard[];
}

export interface NewsCard {
    id: number;
    news: ArticleList;
    order: number;
    publish: boolean;
    slug: string;
}
interface StaticSection {
    id: number;
    title: string;
    description: string;
    background_color: string;
    publish: boolean;
    cards: StaticCard[];
}
interface StaticCard {
    id: number;
    title: string;
    number: number;
    subtext: string | null;
    order: number;
    background_color: string | null;
    publish: boolean;
}

export interface LogoBand {
    id: number;
    order: number;
    logo: string;
    alt: null | string;
    publish: boolean;
}

export interface ImageGallery {
    id: number;
    image: string;
    alt: null | string;
    order: number;
    publish: boolean;
}

export interface HeaderProduct {
  id: number;
  banner_image: string;
  banner_image_mobile?: string | null;
  banner_image_tablet?: string | null;
  order: number;
  publish: boolean;
}

export interface HomeBodyText {
    id: number;
    title: string;
    content: string;
    publish: boolean
}
export interface HomePageData {
    page_title: string;
    page_description: string;
    page_keywords: string;
    canonical_link: string;
    meta_tags: [];
    show_terms_and_conditions: boolean;
    show_contact_us: boolean;
    title: string;
    header_texts?: string;
    theme: "1" | "2" | "3";
    header_galleries: HeaderGallery[];
    introduction_text: IntroductionText;
    logo: Logo;
    video: Video;
    product_section: ProductSection;
    news_section: NewsSection;
    static_section: StaticSection;
    logo_bands: LogoBand[];
    image_galleries: ImageGallery[];
    header_products: HeaderProduct[];
    body_text: HomeBodyText;
}

export type HomePageResponse = ApiResponse<HomePageData>;