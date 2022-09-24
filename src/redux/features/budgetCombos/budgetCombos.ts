import { createAsyncThunk, createSlice, nanoid, SerializedError } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import * as SecureStore from 'expo-secure-store';
import { RootState } from '../../store';
import { isOneOf } from '../../isOneOf';

export interface BudgetCombo {
    id: string,
    budgets: [BudgetInBudgetCombo, BudgetInBudgetCombo],
}

export interface BudgetComboToCreate {
    budgets: [BudgetInBudgetCombo, BudgetInBudgetCombo],
}

interface BudgetInBudgetCombo {
    budgetId: string,
    name?: string,
    elegibleAccountIds: Array<string>
    debtorAccountId: string,
}

interface BudgetCombosState {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    objects: BudgetCombo[],
}

const initialState: BudgetCombosState = {
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

const STORAGE_KEY = 'budgetCombos';

const readBudgetCombos = async (): Promise<BudgetCombo[]> => {
    const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

const saveBudgetCombos = async (budgetCombos: BudgetCombo[]): Promise<void> => {
    const jsonValue = JSON.stringify(budgetCombos);
    await SecureStore.setItemAsync(STORAGE_KEY, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
};

export const fetchBudgetCombos = createAsyncThunk('budgetCombos/fetchBudgetCombos', async () => {
    return readBudgetCombos();
});

export const updateBudgetCombo = createAsyncThunk<
    BudgetCombo[], { budgetCombo: BudgetCombo }, { state: RootState }
>('budgetCombos/updateBudgetCombo', async ({ budgetCombo }, { getState }) => {
    const newBudgetCombos = [...getState().budgetCombos.objects];
    const index = newBudgetCombos.findIndex((c) => c.id = budgetCombo.id);

    newBudgetCombos[index] = budgetCombo;

    await saveBudgetCombos(newBudgetCombos);

    return newBudgetCombos;
});

export const addBudgetCombo = createAsyncThunk<
    BudgetCombo[], BudgetComboToCreate, { state: RootState }
>('budgetCombos/addBudgetCombo', async (budgetCombo, thunkAPI) => {
    const newBudgetCombo: BudgetCombo = { ...budgetCombo, id: nanoid() };
    const newBudgetCombos = [...thunkAPI.getState().budgetCombos.objects, newBudgetCombo];

    await saveBudgetCombos(newBudgetCombos);

    return newBudgetCombos;
});

export const deleteBudgetCombo = createAsyncThunk<
    BudgetCombo[], string, { state: RootState }
>('budgetCombos/deleteBudgetCombo', async (budgetComboId, thunkAPI) => {
    const newBudgetCombos = thunkAPI.getState().budgetCombos.objects.filter((budgetCombo) => budgetCombo.id !== budgetComboId);
    await saveBudgetCombos(newBudgetCombos);

    return newBudgetCombos;
});

export const budgetCombosSlice = createSlice({
    name: 'budgetCombos',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchBudgetCombos.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchBudgetCombos.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addCase(fetchBudgetCombos.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            })
            .addMatcher(isOneOf([updateBudgetCombo.pending, addBudgetCombo.pending, deleteBudgetCombo.pending]), (state) => {
                state.saveStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addMatcher(isOneOf([updateBudgetCombo.fulfilled, addBudgetCombo.fulfilled, deleteBudgetCombo.fulfilled]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addMatcher(isOneOf([updateBudgetCombo.rejected, addBudgetCombo.rejected, deleteBudgetCombo.rejected]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectBudgetCombos = (state: RootState) => state.budgetCombos.objects;
export const selectBudgetCombosFetchStatus = (state: RootState) => state.budgetCombos.fetchStatus;
export const selectBudgetCombosSaveStatus = (state: RootState) => state.budgetCombos.saveStatus;
