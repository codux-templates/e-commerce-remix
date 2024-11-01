import { faker } from '@faker-js/faker';
import { cart as wixEcomCart } from '@wix/ecom';
import { Cart, CartItemDetails, CartTotals } from '~/lib/ecom';

export const cartItem = createCartItem();
export const cartItemWithDiscount = createCartItem({
    price: createPriceObject(200),
    fullPrice: createPriceObject(400),
    image: 'https://static.wixstatic.com/media/22e53e_b53f9a53db034e178a3f2d794ae70f1c~mv2.jpg/v1/fit/w_200,h_200,q_90/file.jpg',
});
export const cartItemOutOfStock = createCartItem({
    availability: { status: wixEcomCart.ItemAvailabilityStatus.NOT_AVAILABLE },
    image: 'https://static.wixstatic.com/media/22e53e_7066c7318bb34be38d3a4f2e3a256021~mv2.jpg/v1/fit/w_240,h_4000,q_90/file.jpg',
});

export const cart: Cart = {
    _id: faker.string.uuid(),
    currency: '$',
    lineItems: [cartItem, cartItemWithDiscount, cartItemOutOfStock],
    appliedDiscounts: [],
    conversionCurrency: 'USD',
    weightUnit: wixEcomCart.WeightUnit.KG,
};

export const cartTotals: CartTotals = {
    currency: '$',
    additionalFees: [],
    appliedDiscounts: [],
    calculatedLineItems: [],
    violations: [],
    weightUnit: wixEcomCart.WeightUnit.KG,
    priceSummary: {
        subtotal: createPriceObject(1650),
    },
};

function createCartItem(overrides: Partial<CartItemDetails> = {}): CartItemDetails {
    return {
        _id: faker.string.uuid(),
        availability: {
            status: wixEcomCart.ItemAvailabilityStatus.AVAILABLE,
        },
        productName: {
            original: faker.lorem.words(2),
            translated: faker.lorem.words(2),
        },
        quantity: faker.number.int({ min: 1, max: 10 }),
        image: 'https://static.wixstatic.com/media/22e53e_1addd1e1b4c64c9abd47dbc5f36d4b01~mv2.jpg/v1/fit/w_100,h_100,q_90/file.jpg',
        paymentOption: wixEcomCart.PaymentOptionType.FULL_PAYMENT_ONLINE,
        price: createPriceObject(),
        fullPrice: createPriceObject(),
        descriptionLines: [],
        url: '',
        couponScopes: [],
        savePaymentMethod: false,
        fixedQuantity: false,
        priceUndetermined: false,
        customLineItem: false,
        ...overrides,
    };
}

function createPriceObject(amount: number = 500, convertedAmount: number = amount) {
    return {
        amount: amount.toString(),
        convertedAmount: convertedAmount.toString(),
        formattedAmount: `$${amount}`,
        formattedConvertedAmount: `$${convertedAmount}`,
    };
}
