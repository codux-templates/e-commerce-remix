import type { EcomAPI } from './api/ecom-api';

export type Cart = Awaited<ReturnType<EcomAPI['getCart']>>;
export type Product = Exclude<Awaited<ReturnType<EcomAPI['getProduct']>>, undefined>;
export type Media = Exclude<Exclude<Product['media'], undefined>['mainMedia'], undefined>;
export type CartTotals = Exclude<Awaited<ReturnType<EcomAPI['getCartTotals']>>, undefined>;
export type Category = Exclude<Awaited<ReturnType<EcomAPI['getCategoryBySlug']>>, undefined>;
