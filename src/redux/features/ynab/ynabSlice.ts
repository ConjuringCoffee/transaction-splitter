import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { Budget, Category, getBudgetsWithAccountsFromApi, getCategories } from "../../../YnabApi/YnabApiWrapper";
import { RootState } from "../../store";

interface YnabState {
    fetchBudgetsStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    }
    budgets: Budget[],
    categories: {
        [budgetId: string]: {
            status: 'loading' | 'successful' | 'error'
            error: SerializedError | null,
            entities: Category[]
        }
    }
}

const initialState: YnabState = {
    fetchBudgetsStatus: {
        status: 'idle',
        error: null
    },
    budgets: [],
    categories: {}
}

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
                    status: 'loading',
                    error: null
                };
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.fetchBudgetsStatus = {
                    status: 'successful',
                    error: null
                }
                state.budgets = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.fetchBudgetsStatus = {
                    status: 'error',
                    error: action.error
                }
            })
            .addCase(fetchCategories.pending, (state, action) => {
                state.categories[action.meta.arg] = {
                    status: "loading",
                    error: null,
                    entities: []
                }
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories[action.meta.arg] = {
                    status: "successful",
                    error: null,
                    entities: action.payload
                }
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categories[action.meta.arg] = {
                    status: "error",
                    error: action.error,
                    entities: []
                }
            })
    }
});

export default ynabSlice.reducer;

export const selectBudgets = (state: RootState) => state.ynab.budgets;
export const selectBudgetsFetchStatus = (state: RootState) => state.ynab.fetchBudgetsStatus;
export const selectBudgetById = (state: RootState, budgetId: string) => {
    const budget = state.ynab.budgets.find((budget) => budget.id === budgetId);

    if (!budget) {
        throw new Error(`Expected to find a budget for ID ${budgetId}, but did not`);
    }

    return budget;
}

export const selectAccountById = (state: RootState, budgetId: string, accountId: string) => {
    const budget = selectBudgetById(state, budgetId);

    const account = budget.accounts.find((account) => account.id === accountId);

    if (!account) {
        throw new Error(`Expected to find an account for ID ${accountId} in budget ${budget.name}, but did not`);
    }

    return account;
}

export const selectActiveAccounts = (state: RootState, budgetId: string) => {
    const budget = selectBudgetById(state, budgetId);
    return budget.accounts.filter((account) => account.onBudget && !account.closed && !account.deleted);
}

export const selectCategoriesFetchStatus = (state: RootState, budgetId: string): 'idle' | 'loading' | 'successful' | 'error' =>
    state.ynab.categories[budgetId]?.status ?? 'idle';


export const selectActiveCategories = (state: RootState, budgetId: string) => {
    const object = state.ynab.categories[budgetId];
    return object
        ? object.entities.filter((category) => !category.deleted && !category.hidden)
        : [];
}