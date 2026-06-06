import { useCallback } from 'react';
import { selectBudgetCurrencySymbol, selectBudgetSymbolFirst } from '../redux/features/ynab/ynabSlice';
import { useAppSelector } from './useAppSelector';

export const useCurrencyFormat = (budgetId: string) => {
    const currencySymbol = useAppSelector((state) => selectBudgetCurrencySymbol(state, budgetId));
    const symbolFirst = useAppSelector((state) => selectBudgetSymbolFirst(state, budgetId));

    const formatAmount = useCallback(
        (amount: string) => symbolFirst ? `${currencySymbol}${amount}` : `${amount}${currencySymbol}`,
        [currencySymbol, symbolFirst],
    );

    return { formatAmount, currencySymbol };
};
