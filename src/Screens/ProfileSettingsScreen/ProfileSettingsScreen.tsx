import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import CustomScrollView from '../../Component/CustomScrollView';
import LoadingComponent from '../../Component/LoadingComponent';
import { DrawerParameterList } from '../../Helper/Navigation/ScreenParameters';
import { Profile, readProfiles, saveProfiles } from '../../Repository/ProfileRepository';
import useBudgets from '../../Hooks/useBudgets';
import { Budget } from '../../YnabApi/YnabApiWrapper';
import ProfileCard from './ProfileCard';
import BudgetHelper from '../../Helper/BudgetHelper';

type MyNavigationProp = DrawerNavigationProp<DrawerParameterList, 'Profile Settings'>;
type MyRouteProp = RouteProp<DrawerParameterList, 'Profile Settings'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface EditableProfile {
    name: string,
    budgetId: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>,
}

const ProfileSettingsScreen = (props: Props) => {
    const [budgets] = useBudgets();
    const [editableProfiles, setEditableProfiles] = useState<EditableProfile[]>();

    const createDefaultProfile = (budget: Budget): EditableProfile => {
        return ({
            name: budget.name,
            budgetId: budget.id,
            debtorAccountId: budget.accounts[0].id,
            elegibleAccountIds: budget.accounts.map((account) => account.id),
        });
    };

    useEffect(() => {
        if (!budgets) {
            return;
        }
        readProfiles()
            .then((profiles) => {
                if (profiles.length === 2) {
                    setEditableProfiles(profiles);
                } else {
                    const defaultEditableProfiles = [
                        createDefaultProfile(budgets[0]),
                        createDefaultProfile(budgets[1])];
                    setEditableProfiles(defaultEditableProfiles);
                }
            })
            .catch((error) => console.error(error));
    }, [budgets]);

    const getBudget = (budgetId: string): Budget => {
        if (!budgets) {
            throw Error('Impossible: Should be impossible if no budgets were read');
        }

        const budget = budgets.find((b) => b.id === budgetId);

        if (!budget) {
            throw Error('Impossible: Selected budget was not read beforehand');
        }

        return budget;
    };

    const createProfileCard = (avaliableBudgets: Array<Budget>, profile: EditableProfile, setProfile: (profile: EditableProfile) => void) => {
        const budget = getBudget(profile.budgetId);
        const budgetHelper = new BudgetHelper(budget);

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
                    const budget = getBudget(budgetId);

                    setProfile({
                        ...profile,
                        budgetId: budget.id,
                        debtorAccountId: budget.accounts[0].id,
                        elegibleAccountIds: budget.accounts.map((account) => account.id),
                    });
                }}
                accounts={budgetHelper.getActiveOnBudgetAccounts()}
                selectedDebtorAccountId={profile.debtorAccountId}
                setDebtorAccountId={(accountId) => {
                    const budget = getBudget(profile.budgetId);

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
            {budgets && editableProfiles
                ? editableProfiles.map((editableProfile, index) => {
                    // TODO: Only enable the selection of a budget in one profile
                    return createProfileCard(budgets, editableProfile, (newEditableProfile) => {
                        const newEditableProfiles = [...editableProfiles];
                        newEditableProfiles[index] = { ...newEditableProfile };
                        setEditableProfiles(newEditableProfiles);
                    });
                })
                : <LoadingComponent />}
            <Button
                disabled={!isSavingAllowed}

                onPress={() => {
                    if (editableProfiles === undefined) {
                        throw new Error('Impossible to get here');
                    }
                    const newProfiles: Array<Profile> = editableProfiles;
                    saveProfiles(newProfiles);
                }}>
                Save
            </Button>
        </CustomScrollView>
    );
};

export default ProfileSettingsScreen;
