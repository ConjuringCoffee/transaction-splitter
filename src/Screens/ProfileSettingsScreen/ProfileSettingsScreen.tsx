import { Button } from '@ui-kitten/components';
import { useLayoutEffect, useState } from 'react';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { Account, Budget } from '../../YnabApi/YnabApiWrapper';
import { ProfileCard } from './ProfileCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { overwriteProfiles, selectAllProfiles } from '../../redux/features/profiles/profilesSlice';
import { selectBudgets } from '../../redux/features/ynab/ynabSlice';

interface EditableProfile {
    name: string,
    budgetId: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>,
}

export const ProfileSettingsScreen = () => {
    const dispatch = useAppDispatch();

    const [editableProfiles, setEditableProfiles] = useState<EditableProfile[]>([]);

    const budgets = useAppSelector(selectBudgets);
    const profiles = useAppSelector(selectAllProfiles);

    useLayoutEffect(() => {
        if (profiles.length === 2) {
            setEditableProfiles(profiles);
        } else {
            const defaultEditableProfiles = [
                createDefaultProfile(budgets[0]),
                createDefaultProfile(budgets[1]),
            ];
            setEditableProfiles(defaultEditableProfiles);
        }
    }, [dispatch, budgets, profiles]);

    const createDefaultProfile = (budget: Budget): EditableProfile => {
        return ({
            name: budget.name,
            budgetId: budget.id,
            debtorAccountId: budget.accounts[0].id,
            elegibleAccountIds: budget.accounts.map((account) => account.id),
        });
    };

    const getBudget = (budgetId: string): Budget => {
        // TODO: Replace this with selector from ynabSlice
        const budget = budgets.find((b) => b.id === budgetId);

        if (!budget) {
            throw Error('Impossible: Selected budget was not read beforehand');
        }

        return budget;
    };

    const getActiveOnBudgetAccounts = (budget: Budget): Account[] => {
        // TODO: Replace this with selector from ynabSlice
        return budget.accounts.filter((e) => e.onBudget && !e.closed && !e.deleted);
    };

    const createProfileCard = (avaliableBudgets: Array<Budget>, profile: EditableProfile, setProfile: (profile: EditableProfile) => void) => {
        const budget = getBudget(profile.budgetId);

        return (
            <ProfileCard
                budgets={avaliableBudgets}
                profileName={profile.name}
                setProfileName={(name) => {
                    setProfile({
                        ...profile,
                        name: name,
                    });
                }}
                selectedBudgetId={profile.budgetId}
                setBudgetId={(budgetId) => {
                    if (budgetId === profile.budgetId) {
                        // Nothing new was selected
                        return;
                    }
                    const newBudget = getBudget(budgetId);

                    setProfile({
                        ...profile,
                        budgetId: newBudget.id,
                        debtorAccountId: newBudget.accounts[0].id,
                        elegibleAccountIds: newBudget.accounts.map((account) => account.id),
                    });
                }}
                accounts={getActiveOnBudgetAccounts(budget)}
                selectedDebtorAccountId={profile.debtorAccountId}
                setDebtorAccountId={(accountId) => {
                    const accounts = budget.accounts.find((a) => a.id === accountId);

                    if (!accounts) {
                        throw Error('Impossible: Selected account is not part of the budget');
                    }

                    setProfile({
                        ...profile,
                        debtorAccountId: accountId,
                    });
                }}
                selectedElegibleAccountIds={profile.elegibleAccountIds}
                setElegibleAccountIds={(accountIds) => {
                    setProfile({
                        ...profile,
                        elegibleAccountIds: accountIds,
                    });
                }} />);
    };

    const isSavingAllowed = editableProfiles ? editableProfiles?.every((editableProfile) => editableProfile.name) : false;

    return (
        <CustomScrollView>
            {editableProfiles.map((editableProfile, index) => {
                // TODO: Only enable the selection of a budget in one profile
                return createProfileCard(budgets, editableProfile, (newEditableProfile) => {
                    const newEditableProfiles = [...editableProfiles];
                    newEditableProfiles[index] = { ...newEditableProfile };
                    setEditableProfiles(newEditableProfiles);
                });
            })}
            <Button
                disabled={!isSavingAllowed}
                onPress={() => {
                    dispatch(overwriteProfiles(editableProfiles));
                }}>
                Save
            </Button>
        </CustomScrollView>
    );
};
