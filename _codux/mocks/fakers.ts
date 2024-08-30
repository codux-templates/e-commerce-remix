import { faker } from '@faker-js/faker';
import { cart } from '@wix/ecom';
import { products } from '@wix/stores';
import type { EcomAPI } from '~/api/ecom-api';
import type { Cart, CartTotals, Category, Media, Product } from '~/types';

export type FakeDataSettings = {
    numberOfCartItems?: number;
    /** @important */
    numberOfProducts?: number;
    /** @important */
    numberOfWordsInTitle?: number;
    /** @important */
    priceMinValue?: number;
    /** @important */
    priceMaxValue?: number;
};

export function createProducts(
    settings?: FakeDataSettings
): Awaited<ReturnType<EcomAPI['getProductsByCategory']>> {
    return Array.from(new Array(settings?.numberOfProducts || 10)).map((id) =>
        createProduct(id, settings)
    );
}

export function createProduct(id?: string, settings?: FakeDataSettings): Product {
    const numOfImages = faker.number.int({ min: 2, max: 4 });
    const images = Array.from(new Array(numOfImages)).map(() => createImage());
    const mainImage = images[faker.number.int({ min: 0, max: numOfImages - 1 })];

    const price = faker.commerce.price({
        symbol: '$',
        min: settings?.priceMinValue,
        max: settings?.priceMaxValue,
    });
    return {
        _id: id ?? faker.string.uuid(),
        slug: faker.lorem.word(),
        name: faker.lorem.words(settings?.numberOfWordsInTitle || 2),
        description: faker.commerce.productDescription(),
        media: {
            items: images,
            mainMedia: mainImage,
        },
        price: {
            formatted: {
                price: price,
                discountedPrice: price,
            },
            currency: 'USD',
            discountedPrice: parseFloat(price),
        },
        productType: products.ProductType.digital,
        additionalInfoSections: [
            { title: 'PRODUCT INFO', description: faker.lorem.paragraph() },
            { title: 'RETURN & REFUND POLICY', description: faker.lorem.paragraph() },
            { title: 'SHIPPING INFO', description: faker.lorem.paragraph() },
        ],
        collectionIds: [],
        customTextFields: [],
        inventoryItemId: '',
        numericId: '',
        productOptions: [],
        ribbons: [],
        variants: [],
    };
}

function createImage(): Media {
    const image = faker.image.dataUri();

    return {
        _id: faker.string.uuid(),
        image: {
            url: image,
        },
        title: faker.lorem.word(),
        mediaType: products.MediaItemType.image,
    };
}

export function createCart(products: products.Product[]): Cart {
    return {
        _id: faker.string.uuid(),
        currency: '$',
        lineItems: products.map(createCartItem),
        appliedDiscounts: [],
        conversionCurrency: 'USD',
        weightUnit: cart.WeightUnit.KG,
    };
}

export function createCartItem(product: products.Product): Cart['lineItems'][0] {
    return {
        _id: faker.string.uuid(),
        productName: {
            original: product.name!,
            translated: product.name,
        },
        quantity: faker.number.int({ min: 1, max: 10 }),
        image: product.media!.mainMedia!.image!.url!,
        paymentOption: cart.PaymentOptionType.FULL_PAYMENT_ONLINE,
        price: createPrice(),
        descriptionLines: [],
        url: '',
        couponScopes: [],
        savePaymentMethod: false,
        fixedQuantity: false,
        priceUndetermined: false,
        customLineItem: false,
    };
}

function createPrice() {
    const priceStr = faker.commerce.price({ symbol: '$' });
    const price = parseFloat(priceStr.replace('$', ''));

    return {
        amount: price.toString(),
        convertedAmount: price.toString(),
        formattedConvertedAmount: priceStr,
        formattedAmount: priceStr,
    };
}

export function getCartTotals(): CartTotals {
    return {
        currency: '$',
        additionalFees: [],
        appliedDiscounts: [],
        calculatedLineItems: [],
        violations: [],
        weightUnit: cart.WeightUnit.KG,
        priceSummary: {
            subtotal: createPrice(),
        },
    };
}

export function createCategory(settings?: FakeDataSettings): Category {
    return {
        _id: faker.string.uuid(),
        numberOfProducts: 1,
        name: faker.lorem.words(),
        description: faker.lorem.words(settings?.numberOfWordsInTitle || 2),
        media: { items: [] },
        slug: faker.lorem.words(),
    };
}
