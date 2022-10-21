import React, { useCallback } from 'react';
import { List } from 'react-native-paper';
import { Updater } from 'use-immer';
import { selectBudgets } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../redux/hooks';
import { Budget } from '../../../YnabApi/YnabApiWrapper';
import { ChooseBudgetListItem } from './ChooseBudgetListItem';
import { EditableBudgetInProfile } from './CreateProfilesScreen/CreateProfileScreen';
import { ProfileBudgetDetailInput } from './ProfileBudgetDetailInput';

interface Props {
    editableBudgetInProfile: EditableBudgetInProfile,
    setEditableBudgetInProfile: Updater<EditableBudgetInProfile>,
}

export const BudgetInProfileInputSection = ({ editableBudgetInProfile, setEditableBudgetInProfile }: Props) => {
    const budgets = useAppSelector(selectBudgets);

    const findBudget = useCallback(
        (id?: string): Budget | undefined => budgets.find((b) => b.id === id),
        [budgets],
    );

    const budget = findBudget(editableBudgetInProfile.budgetId);

    const setBudget = useCallback((id: string) => {
        setEditableBudgetInProfile((draft) => {
            draft.budgetId = id;
            draft.name = undefined;
            draft.debtorAccountId = findBudget(id)!.accounts[0].id;
            draft.elegibleAccountIds = [];
        });
    }, [findBudget, setEditableBudgetInProfile]);

    const setDisplayName = useCallback((name: string) => {
        setEditableBudgetInProfile((draft) => {
            draft.name = name;
        });
    }, [setEditableBudgetInProfile]);

    const setDebtorAccountId = useCallback((id: string) => {
        setEditableBudgetInProfile((draft) => {
            draft.debtorAccountId = id;

            const index = draft.elegibleAccountIds.findIndex((i) => i === id);
            if (index >= 0) {
                draft.elegibleAccountIds.splice(index, 1);
            }
        });
    }, [setEditableBudgetInProfile]);

    const toggleAccountElegible = useCallback((id: string) => {
        setEditableBudgetInProfile((draft) => {
            const index = draft.elegibleAccountIds.findIndex((i) => i === id);

            if (index >= 0) {
                draft.elegibleAccountIds.splice(index, 1);
            } else {
                draft.elegibleAccountIds.push(id);
            }
        });
    }, [setEditableBudgetInProfile]);

    return (
        <List.Section>
            <ChooseBudgetListItem
                selectedBudgetId={editableBudgetInProfile.budgetId}
                selectBudgetId={setBudget}
            />
            {budget
                ? <ProfileBudgetDetailInput
                    budgetId={budget.id}
                    displayName={editableBudgetInProfile.name}
                    setDisplayName={setDisplayName}
                    // Non-null assertion OK because it is immediately initialized when a budget is selected
                    debtorAccountId={editableBudgetInProfile.debtorAccountId!}
                    setDebtorAccountId={setDebtorAccountId}
                    elegibleAccountIds={editableBudgetInProfile.elegibleAccountIds}
                    toggleAccountElegible={toggleAccountElegible}
                />
                : null
            }
        </List.Section>
    );
};
