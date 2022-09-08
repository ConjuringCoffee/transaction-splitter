import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { Account, Budget, Category, getBudgetsWithAccountsFromApi, getCategories } from '../../../YnabApi/YnabApiWrapper';
import { RootState } from '../../store';

interface YnabState {
    fetchBudgetsStatus: {
        status: LoadingStatus
        error: SerializedError | null
    }
    budgets: Budget[],
    categories: {
        [budgetId: string]: {
            status: LoadingStatus
            error: SerializedError | null,
            entities: Category[]
        }
    }
}

const initialState: YnabState = {
    fetchBudgetsStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    budgets: [],
    categories: {},
};

export const fetchBudgets = createAsyncThunk('ynab/fetchBudgets', async () => {
    return getBudgetsWithAccountsFromApi();
});

export const fetchCategories = createAsyncThunk('ynab/fetchCategories', async (budgetId: string) => {
    return getCategories(budgetId);
});

export const ynabSlice = createSlice({
    name: 'ynab',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchBudgets.pending, (state) => {
                state.fetchBudgetsStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.fetchBudgetsStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.budgets = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.fetchBudgetsStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            })
            .addCase(fetchCategories.pending, (state, action) => {
                state.categories[action.meta.arg] = {
                    status: LoadingStatus.LOADING,
                    error: null,
                    entities: [],
                };
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories[action.meta.arg] = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                    entities: action.payload,
                };
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categories[action.meta.arg] = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                    entities: [],
                };
            });
    },
});

export const selectBudgets = (state: RootState) => state.ynab.budgets;
export const selectBudgetsFetchStatus = (state: RootState) => state.ynab.fetchBudgetsStatus;
export const selectBudgetById = (state: RootState, budgetId: string): Budget => {
    const budget = state.ynab.budgets.find((budget) => budget.id === budgetId);

    if (!budget) {
        throw new Error(`Expected to find a budget for ID ${budgetId}, but did not`);
    }

    return budget;
};

export const selectAccountById = (state: RootState, budgetId: string, accountId: string): Account => {
    const budget = selectBudgetById(state, budgetId);

    const account = budget.accounts.find((account) => account.id === accountId);

    if (!account) {
        throw new Error(`Expected to find an account for ID ${accountId} in budget ${budget.name}, but did not`);
    }

    return account;
};

export const selectActiveAccounts = (state: RootState, budgetId: string): Account[] => {
    const budget = selectBudgetById(state, budgetId);
    return budget.accounts.filter((account) => account.onBudget && !account.closed && !account.deleted);
};

export const selectCategoriesFetchStatus = (state: RootState, budgetId: string): LoadingStatus =>
    state.ynab.categories[budgetId]?.status ?? LoadingStatus.IDLE;


export const selectActiveCategories = (state: RootState, budgetId: string): Category[] => {
    const object = state.ynab.categories[budgetId];
    return object
        ? object.entities.filter((category) => !category.deleted && !category.hidden)
        : [];
};
