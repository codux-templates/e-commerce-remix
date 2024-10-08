export interface SearchResponse {
    results: SearchResult[];
}

export interface SearchResult {
    id: string;
    type: 'site_pages' | 'products';
    url: string;
    title: string;
    description: string;
    relevance: number;
    img?: string;
    stock?: 'available' | string;
    sku?: string;
    price?: string;
    originalPrice?: string;
    original_price?: string;
    onSale?: boolean | string;
    info?: string;
    rank_features: {
        description: number;
        tags: number;
        ann: number;
        title: number;
    };
    inventory?: number;
    status?: string;
    summary?: string;
}
