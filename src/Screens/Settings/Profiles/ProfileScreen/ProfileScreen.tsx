import React, { useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';
import { useImmer } from 'use-immer';
import { Appbar } from 'react-native-paper';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { BudgetInProfileInputSection, EditableBudgetInProfile } from '../BudgetInProfileInputSection';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';
import { useTheme } from '../../../../Hooks/useTheme';
import { useAppSelector } from '../../../../Hooks/useAppSelector';
import { useThrowingDispatch } from '../../../../Hooks/useThrowingDispatch';
import { deleteAllCategoryCombos, selectCategoryCombos } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { BudgetInProfile, Profile, saveProfile, selectProfile } from '../../../../redux/features/profile/profileSlice';

type ScreenName = 'Profile';

const SCREEN_TITLE = 'Profile';
const ICON_SAVE = 'check';
const EMPTY_BUDGET: EditableBudgetInProfile = { elegibleAccountIds: [] };

const isBudgetValid = (budget: EditableBudgetInProfile): boolean =>
    [budget.budgetId, budget.debtorAccountId, budget.elegibleAccountIds.length >= 1].every(Boolean);

const finalizeBudget = (budget: EditableBudgetInProfile): BudgetInProfile => {
    if (budget.budgetId === undefined || budget.debtorAccountId === undefined) {
        throw new Error('Editable budget does not contain all data to be finalized');
    }
    return {
        budgetId: budget.budgetId,
        name: budget.name === '' ? undefined : budget.name,
        debtorAccountId: budget.debtorAccountId,
        elegibleAccountIds: budget.elegibleAccountIds,
        defaultEligibleAccountId: budget.defaultEligibleAccountId,
    };
};

export const ProfileScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const savedProfile = useAppSelector(selectProfile);
    const categoryCombos = useAppSelector(selectCategoryCombos);
    const throwingDispatch = useThrowingDispatch();
    const [navigateBack] = useNavigateBack(navigation);
    const [theme] = useTheme();

    const [budgetInProfile1, setBudgetInProfile1] = useImmer<EditableBudgetInProfile>(savedProfile ? savedProfile.budgets[0] : EMPTY_BUDGET);
    const [budgetInProfile2, setBudgetInProfile2] = useImmer<EditableBudgetInProfile>(savedProfile ? savedProfile.budgets[1] : EMPTY_BUDGET);

    const isValid = useMemo(
        () => isBudgetValid(budgetInProfile1) && isBudgetValid(budgetInProfile2) && budgetInProfile1.budgetId !== budgetInProfile2.budgetId,
        [budgetInProfile1, budgetInProfile2],
    );

    const budgetIdsChanged = budgetInProfile1.budgetId !== savedProfile?.budgets[0].budgetId
        || budgetInProfile2.budgetId !== savedProfile?.budgets[1].budgetId;

    const performSave = useCallback(async (): Promise<void> => {
        try {
            if (budgetIdsChanged && categoryCombos.length > 0) {
                await throwingDispatch(deleteAllCategoryCombos());
            }
            const profile: Profile = {
                budgets: [finalizeBudget(budgetInProfile1), finalizeBudget(budgetInProfile2)],
            };
            await throwingDispatch(saveProfile(profile));
            navigateBack();
        } catch {
            Alert.alert('Error', 'Could not save. Please try again.');
        }
    }, [budgetIdsChanged, budgetInProfile1, budgetInProfile2, categoryCombos.length, navigateBack, throwingDispatch]);

    const saveAndNavigate = useCallback((): void => {
        if (budgetIdsChanged && categoryCombos.length > 0) {
            Alert.alert(
                'Delete category combos?',
                'Changing the budget will delete all category combos. This cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete & Save', style: 'destructive', onPress: performSave },
                ],
            );
        } else {
            void performSave();
        }
    }, [budgetIdsChanged, categoryCombos.length, performSave]);

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                key='save'
                icon={ICON_SAVE}
                iconColor={theme.colors.onPrimary}
                disabled={!isValid}
                onPress={saveAndNavigate}
            />
        ),
        [isValid, saveAndNavigate, theme],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    return (
        <CustomScrollView>
            <View style={{ gap: theme.spacing }}>
                <BudgetInProfileInputSection
                    editableBudgetInProfile={budgetInProfile1}
                    setEditableBudgetInProfile={setBudgetInProfile1}
                />
                <BudgetInProfileInputSection
                    editableBudgetInProfile={budgetInProfile2}
                    setEditableBudgetInProfile={setBudgetInProfile2}
                />
            </View>
        </CustomScrollView>
    );
};
