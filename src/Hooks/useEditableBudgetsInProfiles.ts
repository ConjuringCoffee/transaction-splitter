import { useCallback, useMemo } from 'react';
import { Updater, useImmer } from 'use-immer';
import { addProfile, BudgetInProfile, Profile, ProfileToCreate, selectProfile, updateProfile } from '../redux/features/profiles/profilesSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export type EditableBudgetInProfile = {
    budgetId?: string,
    name?: string,
    debtorAccountId?: string,
    elegibleAccountIds: Array<string>
}

export type Returning = [
    EditableBudgetInProfile,
    Updater<EditableBudgetInProfile>,
    EditableBudgetInProfile,
    Updater<EditableBudgetInProfile>,
    boolean,
    () => Promise<void>,
];

export const useEditableBudgetsInProfiles = (profileId?: string): Returning => {
    const savedProfile = useAppSelector((state) => selectProfile(state, profileId));

    const emptyBudgetInProfile: EditableBudgetInProfile = { elegibleAccountIds: [] };

    // TODO: Convert the two separate states into a single tuple state
    const [budgetInProfile1, setBudgetInProfile1] = useImmer<EditableBudgetInProfile>(savedProfile ? savedProfile.budgets[0] : emptyBudgetInProfile);
    const [budgetInProfile2, setBudgetInProfile2] = useImmer<EditableBudgetInProfile>(savedProfile ? savedProfile.budgets[1] : emptyBudgetInProfile);

    const dispatch = useAppDispatch();

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
        };
    }, []);

    const save = useCallback(async (): Promise<void> => {
        if (savedProfile) {
            const profileToUpdate: Profile = {
                id: savedProfile.id,
                budgets: [
                    finalizeEditableBudgetInProfile(budgetInProfile1),
                    finalizeEditableBudgetInProfile(budgetInProfile2),
                ],
            };
            dispatch(updateProfile({ profile: profileToUpdate }));
        } else {
            const profileToAdd: ProfileToCreate = {
                budgets: [
                    finalizeEditableBudgetInProfile(budgetInProfile1),
                    finalizeEditableBudgetInProfile(budgetInProfile2),
                ],
            };
            dispatch(addProfile(profileToAdd));
        }
    }, [finalizeEditableBudgetInProfile, budgetInProfile1, budgetInProfile2, savedProfile, dispatch]);

    return [
        budgetInProfile1,
        setBudgetInProfile1,
        budgetInProfile2,
        setBudgetInProfile2,
        isValid,
        save,
    ];
};
