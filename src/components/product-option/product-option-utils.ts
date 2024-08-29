import { products } from '@wix/stores';

export function getChoiceValue(
    option: products.ProductOption | undefined,
    choice: products.Choice | undefined
): string | undefined {
    if (option !== undefined && choice !== undefined) {
        if (option.optionType === products.OptionType.color && choice.description !== undefined) {
            return choice.description;
        }

        return choice.value;
    }

    return undefined;
}
