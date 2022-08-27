import { Account, Budget, Category } from '../../YnabApi/YnabApiWrapper';
import { CategoryCombo } from '../../Repository/CategoryComboRepository';
import {
    nameSplittingScreen, nameAmountsScreen, nameSaveScreen, nameCategoryScreen,
    nameAccessTokenScreen, nameCalculatorScreen, nameCalculationHistoryScreen, nameProfileSettingsScreen,
    nameCategoryComboSettingsScreen, nameCategoryComboScreen, nameSettingsOverviewScreen,
} from './ScreenNames';
import * as ynab from 'ynab';

interface BasicData {
    payer: PayerData,
    debtor: DebtorData,
    payeeName: string,
    date: string,
    memo: string
    totalAmount: number
}

interface PayerData {
    budget: Budget,
    account: Account,
    transferAccount: Account
}

interface DebtorData {
    budget: Budget,
    account: Account
}

type StackParameterList = {
    [nameSplittingScreen]: undefined;
    [nameSettingsOverviewScreen]: undefined;
    [nameAmountsScreen]: {
        basicData: BasicData
    };
    [nameSaveScreen]: {
        basicData: BasicData
        payerCategories: Array<Category>
        debtorCategories: Array<Category>
        payerSaveTransaction: ynab.SaveTransaction
        debtorSaveTransaction: ynab.SaveTransaction
    };
    [nameCategoryScreen]: {
        categories: Array<Category>
        onSelect: (categoryId?: string) => void
    };
    [nameCategoryComboScreen]: {
        categoryCombos: CategoryCombo[],
        onSelect: (categoryCombo: CategoryCombo) => void
    }
    [nameCalculatorScreen]: {
        currentAmount: number,
        setAmount: (amount: number) => void
        previousCalculations: Array<string>
        setPreviousCalculations: (previousCalculations: Array<string>) => void
    }
    [nameCalculationHistoryScreen]: {
        previousCalculations: Array<string>,
        onSelectCalculation: (calculation: string) => void
    }
    [nameAccessTokenScreen]: undefined;
    [nameProfileSettingsScreen]: undefined;
    [nameCategoryComboSettingsScreen]: undefined;
}

export type { StackParameterList, BasicData };
