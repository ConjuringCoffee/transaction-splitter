import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import * as SecureStore from 'expo-secure-store';
import { isOneOf } from "../../isOneOf";

interface CategoryInCategoryCombo {
    id: string,
    budgetId: string
}
export interface CategoryCombo {
    name: string,
    categories: [CategoryInCategoryCombo, CategoryInCategoryCombo]
}
interface CategoryCombosState {
    fetchStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    },
    saveStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    }
    objects: CategoryCombo[],
}

const initialState: CategoryCombosState = {
    fetchStatus: {
        status: 'idle',
        error: null
    },
    saveStatus: {
        status: 'idle',
        error: null
    },
    objects: [],
}

const storageKey = 'categoryCombos';

const readCategoryCombos = async (): Promise<CategoryCombo[]> => {
    const jsonValue = await SecureStore.getItemAsync(storageKey);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

const saveCategoryCombos = async (categoryCombos: CategoryCombo[]): Promise<CategoryCombo[]> => {
    const jsonValue = JSON.stringify(categoryCombos);
    await SecureStore.setItemAsync(storageKey, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
    return categoryCombos;
}

export const fetchCategoryCombos = createAsyncThunk('categoryCombos/fetchCategoryCombos', async () => {
    return readCategoryCombos();
});

export const updateCategoryCombo = createAsyncThunk<
    CategoryCombo[], { index: number, categoryCombo: CategoryCombo }, { state: RootState }
>('categoryCombos/updateCategoryCombo', async ({ index, categoryCombo }, { getState }) => {
    const newCategoryCombos = [...getState().categoryCombos.objects];
    newCategoryCombos[index] = categoryCombo;

    return saveCategoryCombos(newCategoryCombos);
});

export const addCategoryCombo = createAsyncThunk<
    CategoryCombo[], CategoryCombo, { state: RootState }
>('categoryCombos/addCategoryCombo', async (categoryCombo, thunkAPI) => {
    const newCategoryCombos = [...thunkAPI.getState().categoryCombos.objects, categoryCombo];

    return saveCategoryCombos(newCategoryCombos);
});

export const deleteCategoryCombo = createAsyncThunk<
    CategoryCombo[], number, { state: RootState }
>('categoryCombos/deleteCategoryCombo', async (index, thunkAPI) => {
    const newCategoryCombos = [...thunkAPI.getState().categoryCombos.objects];
    newCategoryCombos.splice(index, 1);

    return saveCategoryCombos(newCategoryCombos);
});

export const categoryCombosSlice = createSlice({
    name: 'categoryCombos',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCategoryCombos.pending, (state) => {
                state.fetchStatus = {
                    status: 'loading',
                    error: null
                };
            })
            .addCase(fetchCategoryCombos.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: 'successful',
                    error: null
                }
                state.objects = action.payload;
            })
            .addCase(fetchCategoryCombos.rejected, (state, action) => {
                state.fetchStatus = {
                    status: 'error',
                    error: action.error
                }
            })
            .addMatcher(isOneOf([updateCategoryCombo.pending, addCategoryCombo.pending, deleteCategoryCombo.pending]), (state) => {
                state.saveStatus = {
                    status: 'loading',
                    error: null
                }
            })
            .addMatcher(isOneOf([updateCategoryCombo.fulfilled, addCategoryCombo.fulfilled, deleteCategoryCombo.fulfilled]), (state, action) => {
                state.saveStatus = {
                    status: 'successful',
                    error: null
                }
                state.objects = action.payload;
            })
            .addMatcher(isOneOf([updateCategoryCombo.rejected, addCategoryCombo.rejected, deleteCategoryCombo.rejected]), (state, action) => {
                state.saveStatus = {
                    status: 'error',
                    error: action.error
                }
            })
    }
})

export default categoryCombosSlice.reducer;

export const selectAllCategoryCombos = (state: RootState) => state.categoryCombos.objects;
export const selectCategoryComboFetchStatus = (state: RootState) => state.categoryCombos.fetchStatus;
export const selectCategoryComboSaveStatus = (state: RootState) => state.categoryCombos.saveStatus;
