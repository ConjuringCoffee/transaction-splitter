import { Budget } from "../YnabApi/YnabApiWrapper";

class BudgetsHelper implements BudgetsHelper {
    private budgets: Budget[];

    public constructor(budgets: Budget[]) {
        this.budgets = budgets;
    }

    /**
     * Gets the budget with the supplied ID.
     * Raises an error if the ID is undefined or the budget cannot be found.
     */
    public getBudget(id?: string): Budget {
        if (!id) {
            throw new Error(`Was supposed to find a budget, but no ID was given`);
        }

        const budget = this.budgets.find((b) => b.id === id);

        if (budget === undefined) {
            throw new Error(`Expected to find a budget for ID ${id}, but did not`);
        }

        return budget;
    }
}

export default BudgetsHelper;
