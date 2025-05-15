import { createAsyncThunk, createSlice, nanoid, SerializedError } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { isOneOf } from '../../isOneOf';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { RootState } from '../RootState';

type CategoryInCategoryCombo = {
    id: string,
    budgetId: string
}
export type CategoryCombo = {
    id: string,
    name: string,
    categories: [CategoryInCategoryCombo, CategoryInCategoryCombo]
}

export type CategoryComboToCreate = Omit<CategoryCombo, 'id'>;

type CategoryCombosState = {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus
        error: SerializedError | null
    }
    objects: CategoryCombo[],
}

const initialState: CategoryCombosState = {
    fetchStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    saveStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    objects: [],
};

const STORAGE_KEY = 'categoryCombos';

const readCategoryCombos = async (): Promise<CategoryCombo[]> => {
    const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

const saveCategoryCombos = async (categoryCombos: CategoryCombo[]): Promise<void> => {
    const jsonValue = JSON.stringify(categoryCombos);
    await SecureStore.setItemAsync(STORAGE_KEY, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
};

export const fetchCategoryCombos = createAsyncThunk('categoryCombos/fetchCategoryCombos', async () => {
    const categoryCombos = await readCategoryCombos();
    return categoryCombos;
});

export const updateCategoryCombo = createAsyncThunk<
    CategoryCombo[], { categoryCombo: CategoryCombo }, { state: RootState }
>('categoryCombos/updateCategoryCombo', async ({ categoryCombo }, { getState }) => {
    const newCategoryCombos = [...getState().categoryCombos.objects];
    const index = newCategoryCombos.findIndex((c) => c.id = categoryCombo.id);

    newCategoryCombos[index] = categoryCombo;

    await saveCategoryCombos(newCategoryCombos);

    return newCategoryCombos;
});

export const addCategoryCombo = createAsyncThunk<
    CategoryCombo[], CategoryComboToCreate, { state: RootState }
>('categoryCombos/addCategoryCombo', async (categoryCombo, thunkAPI) => {
    const newCategoryCombo: CategoryCombo = { ...categoryCombo, id: nanoid() };
    const newCategoryCombos = [...thunkAPI.getState().categoryCombos.objects, newCategoryCombo];

    await saveCategoryCombos(newCategoryCombos);

    return newCategoryCombos;
});

export const deleteCategoryCombo = createAsyncThunk<
    CategoryCombo[], string, { state: RootState }
>('categoryCombos/deleteCategoryCombo', async (categoryComboId, thunkAPI) => {
    const newCategoryCombos = thunkAPI.getState().categoryCombos.objects.filter((categoryCombo) => categoryCombo.id !== categoryComboId);
    await saveCategoryCombos(newCategoryCombos);

    return newCategoryCombos;
});

export const deleteAllCategoryCombos = createAsyncThunk('categoryCombos/deleteAllCategoryCombos', async () => {
    const newCategoryCombos: CategoryCombo[] = [];
    await saveCategoryCombos(newCategoryCombos);
    return newCategoryCombos;
});

export const categoryCombosSlice = createSlice({
    name: 'categoryCombos',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCategoryCombos.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchCategoryCombos.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addCase(fetchCategoryCombos.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            })
            .addMatcher(isOneOf([updateCategoryCombo.pending, addCategoryCombo.pending, deleteCategoryCombo.pending, deleteAllCategoryCombos.pending]), (state) => {
                state.saveStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addMatcher(isOneOf([updateCategoryCombo.fulfilled, addCategoryCombo.fulfilled, deleteCategoryCombo.fulfilled, deleteAllCategoryCombos.fulfilled]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addMatcher(isOneOf([updateCategoryCombo.rejected, addCategoryCombo.rejected, deleteCategoryCombo.rejected, deleteAllCategoryCombos.rejected]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectCategoryCombos = (state: RootState) => state.categoryCombos.objects;
export const selectCategoryCombosFetchStatus = (state: RootState) => state.categoryCombos.fetchStatus;
export const selectCategoryCombosSaveStatus = (state: RootState) => state.categoryCombos.saveStatus;
export const selectCategoryCombo = (state: RootState, categoryComboId: string): CategoryCombo => {
    const categoryCombo = state.categoryCombos.objects.find((c) => c.id === categoryComboId);

    if (!categoryCombo) {
        throw new Error(`Expected to find a category como for ID ${categoryComboId}, but did not`);
    }

    return categoryCombo;
};
