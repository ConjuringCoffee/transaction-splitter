import { Account, Budget } from "../YnabApi/YnabApiWrapper";

class BudgetHelper {
    private budget: Budget;

    public constructor(budget: Budget) {
        this.budget = budget;
    }

    /**
     * Gets the account with the supplied ID from the budget.
     * Raises an error if the ID is undefined or the account cannot be found.
     */
    public getAccount(id?: string): Account {
        if (id === undefined) {
            throw new Error(`Was supposed to find an account, but no ID was given`);
        }

        const account = this.budget.accounts.find((a) => a.id === id);

        if (account === undefined) {
            throw new Error(`Expected to find an account for ID ${id}, but did not`);
        }

        return account;
    }

    public getActiveOnBudgetAccounts(): Account[] {
        return this.budget.accounts.filter((e, index) => e.onBudget && !e.closed && !e.deleted);
    }
}

export default BudgetHelper;
