import { orders } from '@wix/ecom';

export const mockOrder: orders.Order & orders.OrderNonNullableFields = {
    number: '1002',
    _id: '111111111111',
    lineItems: [
        {
            productName: { original: 'Tets Product' },
            price: {
                amount: '10.00',
                formattedAmount: '$10.00',
            },
            totalPriceBeforeTax: {
                amount: '20.00',
                formattedAmount: '$20.00',
            },
            descriptionLines: [
                {
                    name: {
                        original: 'Color',
                    },
                    lineType: orders.DescriptionLineType.COLOR,
                    colorInfo: {
                        original: 'red',
                    },
                    color: '#A00',
                },
                {
                    name: {
                        original: 'Size',
                    },
                    lineType: orders.DescriptionLineType.PLAIN_TEXT,
                    colorInfo: {
                        original: 'Small',
                    },
                    color: '',
                },
            ],
            _id: '1111111',
            image: `https://static.wixstatic.com/media/22e53e_1addd1e1b4c64c9abd47dbc5f36d4b01~mv2.jpg/v1/fit/w_100,h_100,q_90/file.jpg`,
            locations: [],
            paymentOption: orders.PaymentOptionType.FULL_PAYMENT_OFFLINE,
            quantity: 2,
        },
        {
            productName: { original: 'Another Product' },
            price: {
                amount: '75.00',
                formattedAmount: '$75.00',
            },
            totalPriceBeforeTax: {
                amount: '75.00',
                formattedAmount: '$75.00',
            },
            descriptionLines: [],
            _id: '2222222222',
            image: `https://static.wixstatic.com/media/22e53e_b53f9a53db034e178a3f2d794ae70f1c~mv2.jpg/v1/fit/w_200,h_200,q_90/file.jpg`,
            locations: [],
            paymentOption: orders.PaymentOptionType.FULL_PAYMENT_OFFLINE,
            quantity: 1,
        },
    ],
    priceSummary: {
        subtotal: {
            amount: '95.00',
            formattedAmount: '$95.00',
        },
        shipping: {
            amount: '0.00',
            formattedAmount: '$0.00',
        },
        tax: {
            amount: '0.00',
            formattedAmount: '$0.00',
        },
        total: {
            amount: '95.00',
            formattedAmount: '$95.00',
        },
    },
    billingInfo: {
        contactDetails: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+123 456 78 90',
        },
        address: {
            country: 'USA',
            city: 'North Claudia',
            postalCode: 'M0 40120',
            addressLine1: 'Suite 987 554 Joline Key',
        },
    },
    shippingInfo: {
        title: 'test',
        logistics: {
            shippingDestination: {
                contactDetails: {
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+123 456 78 90',
                },
                address: {
                    country: 'USA',
                    city: 'North Claudia',
                    postalCode: 'M0 40120',
                    addressLine1: 'Suite 987 554 Joline Key',
                },
            },
            deliveryTime: '3-5 business days',
        },
    },
    buyerNote: 'Please wrap these products in separate present boxes :-)',
    activities: [],
    additionalFees: [],
    appliedDiscounts: [],
    attributionSource: orders.AttributionSource.UNSPECIFIED,
    customFields: [],
    fulfillmentStatus: orders.FulfillmentStatus.NOT_FULFILLED,
    isInternalOrderCreate: false,
    paymentStatus: orders.PaymentStatus.NOT_PAID,
    status: orders.OrderStatus.APPROVED,
    taxIncludedInPrices: false,
    weightUnit: orders.WeightUnit.UNSPECIFIED_WEIGHT_UNIT,
};
