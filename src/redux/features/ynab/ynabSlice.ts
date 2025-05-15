import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { Account, Budget, getBudgetsWithAccountsFromApi } from '../../../YnabApi/YnabApiWrapper';
import { RootState } from '../../store';
import * as ynab from 'ynab';

export type CategoryGroup = {
    id: string,
    name: string,
    hidden: boolean,
    deleted: boolean,
    categories: string[],
}

export type Category = {
    id: string;
    name: string;
    hidden: boolean;
    deleted: boolean;
}

type YnabState = {
    fetchBudgetsStatus: {
        status: LoadingStatus
        error: SerializedError | null
    }
    budgets: Budget[],
    categoryGroups: {
        [budgetId: string]: {
            status: LoadingStatus
            error: SerializedError | null,
            groups: {
                [categoryGroupId: string]: CategoryGroup
            },
            categories: {
                [categoryId: string]: Category
            }
        }
    }
}

const initialState: YnabState = {
    fetchBudgetsStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    budgets: [],
    categoryGroups: {},
};

export const fetchBudgets = createAsyncThunk<Budget[], string>('ynab/fetchBudgets', async (accessToken) => {
    return getBudgetsWithAccountsFromApi(accessToken);
});

export const fetchCategoryGroups = createAsyncThunk<
    ynab.CategoryGroupWithCategories[], { accessToken: string, budgetId: string }>('ynab/fetchCategoryGroups', async ({ accessToken, budgetId }) => {
        const ynabAPI = new ynab.API(accessToken);
        const response = await ynabAPI.categories.getCategories(budgetId);
        return response.data.category_groups;
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
            .addCase(fetchCategoryGroups.pending, (state, action) => {
                state.categoryGroups[action.meta.arg.budgetId] = {
                    status: LoadingStatus.LOADING,
                    error: null,
                    groups: {},
                    categories: {},
                };
            })
            .addCase(fetchCategoryGroups.fulfilled, (state, action) => {
                const stateForBudget = state.categoryGroups[action.meta.arg.budgetId];
                stateForBudget.status = LoadingStatus.SUCCESSFUL;
                stateForBudget.error = null;

                for (const categoryGroup of action.payload) {
                    for (const category of categoryGroup.categories) {
                        stateForBudget.categories[category.id] = {
                            id: category.id,
                            name: category.name,
                            hidden: category.hidden,
                            deleted: category.deleted,
                        };
                    }

                    stateForBudget.groups[categoryGroup.id] = {
                        id: categoryGroup.id,
                        name: categoryGroup.name,
                        hidden: categoryGroup.hidden,
                        deleted: categoryGroup.deleted,
                        categories: categoryGroup.categories.map((category) => category.id),
                    };
                }
            })
            .addCase(fetchCategoryGroups.rejected, (state, action) => {
                state.categoryGroups[action.meta.arg.budgetId] = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                    groups: {},
                    categories: {},
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
    state.ynab.categoryGroups[budgetId]?.status ?? LoadingStatus.IDLE;


export const selectCategory = (state: RootState, budgetId: string, categoryId: string): Category => {
    return state.ynab.categoryGroups[budgetId].categories[categoryId];
};

export const selectCategories = (state: RootState, budgetId: string): { [categoryId: string]: Category } => {
    return state.ynab.categoryGroups[budgetId].categories;
};

export const selectCategoryGroups = (state: RootState, budgetId: string): { [categoryGroupId: string]: CategoryGroup } => {
    return state.ynab.categoryGroups[budgetId].groups;
};

export const selectInternalMasterCategoryGroupId = (state: RootState, budgetId: string): string => {
    const masterCategoryGroup = Object.values(state.ynab.categoryGroups[budgetId].groups).find((group) => group.name === 'Internal Master Category');

    if (!masterCategoryGroup) {
        throw new Error('Did not find master category group');
    }

    return masterCategoryGroup?.id;
};
