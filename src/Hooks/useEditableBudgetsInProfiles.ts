import { useCallback, useMemo } from 'react';
import { Updater, useImmer } from 'use-immer';
import { BudgetInProfile, Profile, saveProfile, selectProfile } from '../redux/features/profile/profileSlice';
import { useThrowingDispatch } from './useThrowingDispatch';
import { useAppSelector } from './useAppSelector';

export type EditableBudgetInProfile = {
    budgetId?: string,
    name?: string,
    debtorAccountId?: string,
    elegibleAccountIds: Array<string>,
    defaultEligibleAccountId?: string,
}

export type Returning = [
    EditableBudgetInProfile,
    Updater<EditableBudgetInProfile>,
    EditableBudgetInProfile,
    Updater<EditableBudgetInProfile>,
    boolean,
    () => Promise<void>,
];

export const useEditableBudgetsInProfiles = (): Returning => {
    const savedProfile = useAppSelector(selectProfile);

    const emptyBudgetInProfile: EditableBudgetInProfile = { elegibleAccountIds: [] };

    const [budgetInProfile1, setBudgetInProfile1] = useImmer<EditableBudgetInProfile>(savedProfile ? savedProfile.budgets[0] : emptyBudgetInProfile);
    const [budgetInProfile2, setBudgetInProfile2] = useImmer<EditableBudgetInProfile>(savedProfile ? savedProfile.budgets[1] : emptyBudgetInProfile);

    const throwingDispatch = useThrowingDispatch();

    const isBudgetInProfileValid = useCallback((budgetInProfile: EditableBudgetInProfile): boolean => {
        return [
            budgetInProfile.budgetId,
            budgetInProfile.debtorAccountId,
            budgetInProfile.elegibleAccountIds.length >= 1,
        ].every(Boolean);
    }, []);

    const isValid = useMemo(
        () => isBudgetInProfileValid(budgetInProfile1) && isBudgetInProfileValid(budgetInProfile2) && budgetInProfile1.budgetId !== budgetInProfile2.budgetId,
        [isBudgetInProfileValid, budgetInProfile1, budgetInProfile2],
    );

    const finalizeEditableBudgetInProfile = useCallback((editableBudgetInProfile: EditableBudgetInProfile): BudgetInProfile => {
        if (editableBudgetInProfile.budgetId === undefined || editableBudgetInProfile.debtorAccountId === undefined) {
            throw new Error('Editable budget does not contain all data to be finalized');
        }

        return {
            budgetId: editableBudgetInProfile.budgetId,
            name: editableBudgetInProfile.name === '' ? undefined : editableBudgetInProfile.name,
            debtorAccountId: editableBudgetInProfile.debtorAccountId,
            elegibleAccountIds: editableBudgetInProfile.elegibleAccountIds,
            defaultEligibleAccountId: editableBudgetInProfile.defaultEligibleAccountId,
        };
    }, []);

    const save = useCallback(async (): Promise<void> => {
        const profile: Profile = {
            budgets: [
                finalizeEditableBudgetInProfile(budgetInProfile1),
                finalizeEditableBudgetInProfile(budgetInProfile2),
            ],
        };
        await throwingDispatch(saveProfile(profile));
    }, [finalizeEditableBudgetInProfile, budgetInProfile1, budgetInProfile2, throwingDispatch]);

    return [
        budgetInProfile1,
        setBudgetInProfile1,
        budgetInProfile2,
        setBudgetInProfile2,
        isValid,
        save,
    ];
};
