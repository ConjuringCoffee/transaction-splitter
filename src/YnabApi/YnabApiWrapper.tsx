import { getAccessTokenFromKeychain } from '../Helper/AccessTokenHelper';
import * as ynab from 'ynab';

interface Account {
    id: string;
    name: string;
    onBudget: boolean;
    closed: boolean;
    transferPayeeID: string;
    deleted: boolean;
}

interface Category {
    id: string;
    name: string;
    hidden: boolean;
    deleted: boolean;
}

interface Budget {
    id: string;
    name: string;
    accounts: Array<Account>;
}

const getActiveCategories = async (budgetId: string): Promise<Category[]> => {
    const categories = await getCategories(budgetId);
    return categories.filter((category, index) => !category.deleted && !category.hidden);
};

const getCategoriesGroupedByCategoryGroup = async (apiKey: string, budgetId: string): Promise<ynab.CategoryGroupWithCategories[]> => {
    const ynabAPI = new ynab.API(apiKey);
    const response = await ynabAPI.categories.getCategories(budgetId);
    return response.data.category_groups;
};

const getCategories = async (budgetId: string): Promise<Category[]> => {
    const apiKey = await getAccessTokenFromKeychain();
    const categoryGroups = await getCategoriesGroupedByCategoryGroup(apiKey, budgetId);

    const categories: Array<Category> = [];

    categoryGroups.forEach((categoryGroup) => {
        categoryGroup.categories.forEach((category) => {
            categories.push({
                id: category.id,
                name: category.name,
                hidden: category.hidden,
                deleted: category.deleted,
            });
        });
    });

    return categories;
};

const getBudgetsWithAccountsFromApi = async (): Promise<Budget[]> => {
    const apiKey = await getAccessTokenFromKeychain();
    const ynabAPI = new ynab.API(apiKey);
    const response = await ynabAPI.budgets.getBudgets(true);

    return response.data.budgets.map((budgetSummary, budgetIndex: number) => {
        let accounts: Array<Account> = [];

        if (budgetSummary.accounts != undefined) {
            accounts = budgetSummary.accounts.map((account) => {
                return {
                    id: account.id,
                    name: account.name,
                    onBudget: account.on_budget,
                    closed: account.closed,
                    transferPayeeID: account.transfer_payee_id,
                    deleted: account.deleted,
                };
            });
        }
        return {
            id: budgetSummary.id,
            name: budgetSummary.name,
            accounts: accounts,
        };
    });
};

const getUncategorizedCategory = async (budgetId: string): Promise<Category> => {
    const apiKey = await getAccessTokenFromKeychain();
    const categoryGroups = await getCategoriesGroupedByCategoryGroup(apiKey, budgetId);

    const internalMasterCategoryGroups = categoryGroups.filter((categoryGroup) => {
        return categoryGroup.name === 'Internal Master Category'
            && categoryGroup.deleted === false;
    });

    if (internalMasterCategoryGroups.length === 0) {
        throw new Error('Internal Master Category not found');
    } else if (internalMasterCategoryGroups.length > 1) {
        throw new Error('Unable to recognize Internal Master Category, found more than one');
    }

    const foundCategories = internalMasterCategoryGroups[0].categories.filter((category) => {
        return category.name === 'Uncategorized';
    });

    if (foundCategories.length === 0) {
        throw new Error('Uncategorized category not found');
    } else if (foundCategories.length > 1) {
        throw new Error('Found more than one Uncategorized in the Internal Master Category');
    }

    return foundCategories[0];
};

const verifySavedTransaction = async (
    saveTransaction: ynab.SaveTransaction, transactionDetail: ynab.TransactionDetail, budgetId: string): Promise<void> => {
    const uncategorizedCategory = await getUncategorizedCategory(budgetId);

    const areCategoriesTheSame = (saveId: string, savedId: string) => {
        return (
            (saveId !== uncategorizedCategory.id
                && saveId === savedId)
            || (saveId === uncategorizedCategory.id
                && savedId === null));
    };

    if (saveTransaction.category_id != undefined
        && transactionDetail.category_id != undefined
        && areCategoriesTheSame(saveTransaction.category_id, transactionDetail.category_id)) {
        return;
    } else if (saveTransaction.category_id === undefined
        && saveTransaction.subtransactions != undefined
        && saveTransaction.subtransactions.length > 0) {
        // This is a split and I don't know how else to recognize it as such

        saveTransaction.subtransactions.forEach((saveSubtransaction, saveSubtransactionIndex) => {
            if (saveTransaction.subtransactions == undefined) {
                throw new Error('Impossible to get here');
            }

            const matchingSaveSubtransactions = saveTransaction.subtransactions.filter((t) => {
                return t.amount === saveSubtransaction.amount
                    && t.category_id === saveSubtransaction.category_id
                    && t.payee_id === saveSubtransaction.payee_id;
            });

            const matchingSubtransactions = transactionDetail.subtransactions.filter((t) => {
                return t.amount === saveSubtransaction.amount
                    // Use == because it allows us to compare null (in saved transaction) to undefined (in saveTransaction)
                    && (saveSubtransaction.category_id == t.category_id
                        || (saveSubtransaction.category_id != undefined
                            && t.category_id != undefined
                            && areCategoriesTheSame(saveSubtransaction.category_id, t.category_id)))
                    && t.payee_id == saveSubtransaction.payee_id;
            });

            if (matchingSaveSubtransactions.length !== matchingSubtransactions.length) {
                throw new Error(
                    `Subtransaction with amount ${saveSubtransaction.amount} 
                        not correctly saved for payee ${saveSubtransaction.payee_id} 
                        or category ${saveSubtransaction.category_id}`);
            }
        });

        return;
    } else {
        throw new Error('Transaction format was not recognized by the validator');
    }
};

const createTransaction = async (budgetId: string, saveTransaction: ynab.SaveTransaction): Promise<ynab.TransactionDetail> => {
    const request: ynab.SaveTransactionWrapper = {
        transaction: saveTransaction,
    };

    const apiKey = await getAccessTokenFromKeychain();

    const ynabAPI = new ynab.API(apiKey);
    const response = await ynabAPI.transactions.createTransaction(budgetId, request);
    const transaction = response.data.transaction;

    if (transaction == undefined) {
        throw new Error('API behaved unexpectedly: No single transaction data returned');
    }

    await verifySavedTransaction(saveTransaction, transaction, budgetId);

    return transaction;
};

export type { Account, Category, Budget };
export { getBudgetsWithAccountsFromApi, createTransaction, getCategories, getActiveCategories };
