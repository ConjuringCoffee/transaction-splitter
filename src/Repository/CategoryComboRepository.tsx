import * as SecureStore from 'expo-secure-store';


interface CategoryInCategoryCombo {
    id: string,
    budgetId: string
}
interface CategoryCombo {
    name: string,
    categories: [CategoryInCategoryCombo, CategoryInCategoryCombo]
}

const storageKey = 'categoryCombos';

const readCategoryCombos = async (): Promise<CategoryCombo[]> => {
    const jsonValue = await SecureStore.getItemAsync(storageKey);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

export type { CategoryCombo, CategoryInCategoryCombo };
export { readCategoryCombos };
