import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { MyStackScreenProps } from '../../../../Helper/Navigation/ScreenParameters';
import { useImmer } from 'use-immer';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../../../Helper/Navigation/NavigationBar';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useAppDispatch } from '../../../../redux/hooks';
import { addProfile, BudgetInProfile, ProfileToCreate } from '../../../../redux/features/profiles/profilesSlice';

type ScreenName = 'CreateProfile';

const SCREEN_TITLE = 'Add Profile';
const ICON_SAVE = 'content-save';

export interface EditableBudgetInProfile {
    budgetId?: string,
    name?: string,
    debtorAccountId?: string,
    elegibleAccountIds: Array<string>
}

export const CreateProfileScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    // TODO: Convert the two separate states into a single tuple state
    const [budgetInProfile1, setBudgetInProfile1] = useImmer<EditableBudgetInProfile>({ elegibleAccountIds: [] });
    const [budgetInProfile2, setBudgetInProfile2] = useImmer<EditableBudgetInProfile>({ elegibleAccountIds: [] });

    const dispatch = useAppDispatch();
    const [navigateBack] = useNavigateBack(navigation);

    const isBudgetInProfileValid = useCallback((budgetInProfile: EditableBudgetInProfile): boolean => {
        return [
            budgetInProfile.budgetId,
            budgetInProfile.debtorAccountId,
            budgetInProfile.elegibleAccountIds.length >= 1,
        ].every(Boolean);
    }, []);

    const isValid = useMemo(
        () => isBudgetInProfileValid(budgetInProfile1) && isBudgetInProfileValid(budgetInProfile2),
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

    const saveAndNavigate = useCallback(async (): Promise<void> => {
        const newProfile: ProfileToCreate = {
            budgets: [
                finalizeEditableBudgetInProfile(budgetInProfile1),
                finalizeEditableBudgetInProfile(budgetInProfile2),
            ],
        };
        dispatch(addProfile(newProfile));
        navigateBack();
    }, [budgetInProfile1, budgetInProfile2, finalizeEditableBudgetInProfile, dispatch, navigateBack]);

    useLayoutEffect(() => {
        const addition = <Appbar.Action
            key='save'
            icon={ICON_SAVE}
            disabled={!isValid}
            onPress={saveAndNavigate} />;

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={navigation}
                    additions={addition}
                />
            ),
        });
    }, [navigation, isValid, saveAndNavigate]);

    return (
        <CustomScrollView>
            <BudgetInProfileInputSection
                editableBudgetInProfile={budgetInProfile1}
                setEditableBudgetInProfile={setBudgetInProfile1}
            />
            <BudgetInProfileInputSection
                editableBudgetInProfile={budgetInProfile2}
                setEditableBudgetInProfile={setBudgetInProfile2}
            />
        </CustomScrollView>
    );
};
