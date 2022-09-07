import { Category } from '../../YnabApi/YnabApiWrapper';
import { ScreenNames } from './ScreenNames';
import * as ynab from 'ynab';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { CategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { Profile } from '../../redux/features/profiles/profilesSlice';

interface BasicData {
    payer: {
        budgetId: string,
        accountId: string,
        transferAccountId: string,
        transferAccountPayeeId: string
    },
    debtor: {
        budgetId: string,
        accountId: string,
    },
    payeeName: string,
    date: string,
    memo: string
    totalAmount: number
}

type StackParameterList = {
    [ScreenNames.splittingScreen]: undefined;
    [ScreenNames.settingsOverviewScreen]: undefined;
    [ScreenNames.amountsScreen]: {
        basicData: BasicData
    };
    [ScreenNames.saveScreen]: {
        basicData: BasicData
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
        profiles: Profile[]
        categoriesFirstProfile: Category[],
        categoriesSecondProfile: Category[],
        saveCategoryCombo: (categoryCombo: CategoryCombo) => Promise<void>,
        deleteCategoryCombo?: () => Promise<void>
    }
}

export type MyStackScreenProps<K extends keyof StackParameterList> = StackScreenProps<StackParameterList, K>;
export type MyStackNavigationProp<K extends keyof StackParameterList> = StackNavigationProp<StackParameterList, K>;

export type { StackParameterList, BasicData };
