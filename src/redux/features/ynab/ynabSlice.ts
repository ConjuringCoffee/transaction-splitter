import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { Budget, getBudgetsWithAccountsFromApi } from "../../../YnabApi/YnabApiWrapper";
import { RootState } from "../../store";

interface YnabState {
    fetchBudgetsStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    }
    budgets: Budget[]
}

const initialState: YnabState = {
    fetchBudgetsStatus: {
        status: 'idle',
        error: null
    },
    budgets: []
}

export const fetchBudgets = createAsyncThunk('ynab/fetchBudgets', async () => {
    return getBudgetsWithAccountsFromApi();
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
