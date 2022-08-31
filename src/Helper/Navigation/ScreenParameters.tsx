import { Account, Budget, Category } from '../../YnabApi/YnabApiWrapper';
import { CategoryCombo } from '../../Repository/CategoryComboRepository';
import { ScreenNames } from './ScreenNames';
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
    [ScreenNames.splittingScreen]: undefined;
    [ScreenNames.settingsOverviewScreen]: undefined;
    [ScreenNames.amountsScreen]: {
        basicData: BasicData
    };
    [ScreenNames.saveScreen]: {
        basicData: BasicData
        payerCategories: Array<Category>
        debtorCategories: Array<Category>
        payerSaveTransaction: ynab.SaveTransaction
        debtorSaveTransaction: ynab.SaveTransaction
    };
    [ScreenNames.categoryScreen]: {
        categories: Array<Category>
        onSelect: (categoryId?: string) => void
    };
    [ScreenNames.categoryComboScreen]: {
        categoryCombos: CategoryCombo[],
        onSelect: (categoryCombo: CategoryCombo) => void
    }
    [ScreenNames.calculatorScreen]: {
        currentAmount: number,
        setAmount: (amount: number) => void
        previousCalculations: Array<string>
        setPreviousCalculations: (previousCalculations: Array<string>) => void
    }
    [ScreenNames.calculationHistoryScreen]: {
        previousCalculations: Array<string>,
        onSelectCalculation: (calculation: string) => void
    }
    [ScreenNames.accessTokenScreen]: undefined;
    [ScreenNames.profileSettingsScreen]: undefined;
    [ScreenNames.categoryComboSettingsScreen]: undefined;
    [ScreenNames.editCategoryComboScreen]: {
        categoryCombo?: CategoryCombo,
        categoriesFirstProfile: Category[],
        categoriesSecondProfile: Category[],
        saveCategoryCombo: (categoryCombo: CategoryCombo) => Promise<void>,
        deleteCategoryCombo: () => Promise<void>
    }
}

export type { StackParameterList, BasicData };
