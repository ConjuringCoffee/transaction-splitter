import { useEffect, useState } from 'react';
import { Budget, getBudgetsWithAccountsFromApi } from '../YnabApi/YnabApiWrapper';

const useBudgets = (): [Budget[] | undefined] => {
    const [budgets, setBudgets] = useState<Budget[]>();

    useEffect(() => {
        getBudgetsWithAccountsFromApi()
            .then((budgetListFromApi) => {
                setBudgets(budgetListFromApi);
            }).catch((error) => {
                console.error(error);
                throw new Error(error);
            });
    }, []);

    return [budgets]
};

export default useBudgets;
