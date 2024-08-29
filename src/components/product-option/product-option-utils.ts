import { products } from '@wix/stores';

export function getChoiceValue(
    option: products.ProductOption | undefined,
    choice: products.Choice | undefined
): string | undefined {
    if (option !== undefined && choice !== undefined) {
        /**
         * for color options, `description` field contains color value
         * and `value` field contains hex color representation
         */
        return option.optionType === products.OptionType.color ? choice.description : choice.value;
    }

    return undefined;
}
