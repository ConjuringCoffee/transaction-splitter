import { ScreenNames } from './ScreenNames';
import * as ynab from 'ynab';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { CategoryCombo } from '../redux/features/categoryCombos/categoryCombosSlice';

type BasicData = {
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
    [ScreenNames.SPLITTING_SCREEN]: undefined;
    [ScreenNames.SETTINGS_OVERVIEW_SCREEN]: undefined;
    [ScreenNames.AMOUNTS_SCREEN]: {
        basicData: BasicData
    };
    [ScreenNames.SAVE_SCREEN]: {
        basicData: BasicData
        payerSaveTransaction: ynab.SaveTransaction
        debtorSaveTransaction: ynab.SaveTransaction
    };
    [ScreenNames.CATEGORY_SCREEN]: {
        budgetId: string
        onSelect: (categoryId?: string) => void
    };
    [ScreenNames.SELECT_CATEGORY_COMBO_SCREEN]: {
        onSelect: (categoryComboId: string) => void
    }
    [ScreenNames.CALCULATOR_SCREEN]: {
        currentAmount: number,
        setAmount: (amount: number) => void
        previousCalculations: Array<string>
        setPreviousCalculations: (previousCalculations: Array<string>) => void
    }
    [ScreenNames.CALCULATION_HISTORY_SCREEN]: {
        previousCalculations: Array<string>,
        onSelectCalculation: (calculation: string) => void
    }
    [ScreenNames.ACCESS_TOKEN_SCREEN]: undefined;
    [ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN]: undefined;
    [ScreenNames.EDIT_CATEGORY_COMBO_SCREEN]: {
        categoryCombo: CategoryCombo,
    }
    [ScreenNames.CREATE_CATEGORY_COMBO_SCREEN]: undefined,
    [ScreenNames.DISPLAY_SETTINGS_SCREEN]: undefined;
    [ScreenNames.CREATE_PROFILE_SCREEN]: undefined;
    [ScreenNames.EDIT_PROFILE_SCREEN]: {
        profileId: string,
    };
    [ScreenNames.INITIAL_SCREEN]: undefined;
    [ScreenNames.DEVELOPMENT_SETTINGS_SCREEN]: undefined;
}

export type MyStackScreenProps<K extends keyof StackParameterList> = StackScreenProps<StackParameterList, K>;
export type MyStackNavigationProp<K extends keyof StackParameterList> = StackNavigationProp<StackParameterList, K>;

export type { StackParameterList, BasicData };
