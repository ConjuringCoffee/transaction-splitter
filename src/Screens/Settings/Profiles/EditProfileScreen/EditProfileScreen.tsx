import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { MyStackScreenProps } from '../../../../Helper/Navigation/ScreenParameters';
import { BudgetInProfile, Profile, selectProfileSafely, updateProfile } from '../../../../redux/features/profiles/profilesSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { EditableBudgetInProfile } from '../CreateProfilesScreen/CreateProfileScreen';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../../../Helper/Navigation/NavigationBar';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';

type ScreenName = 'EditProfile';

const SCREEN_TITLE = 'Edit Profile';
const ICON_SAVE = 'content-save';

export const EditProfileScreen = (props: MyStackScreenProps<ScreenName>) => {
    const { navigation } = props;
    const { profileId } = props.route.params;
    const savedProfile = useAppSelector((state) => selectProfileSafely(state, profileId));

    // TODO: Convert the two separate states into a single tuple state
    const [budgetInProfile1, setBudgetInProfile1] = useImmer<EditableBudgetInProfile>(savedProfile.budgets[0]);
    const [budgetInProfile2, setBudgetInProfile2] = useImmer<EditableBudgetInProfile>(savedProfile.budgets[1]);

    const dispatch = useAppDispatch();
    const [navigateBack] = useNavigateBack(navigation);

    // TODO: Remove code duplication to CreateProfileScreen
    const isBudgetInProfileValid = useCallback((budgetInProfile: EditableBudgetInProfile): boolean => {
        return [
            budgetInProfile.budgetId,
            budgetInProfile.debtorAccountId,
            budgetInProfile.elegibleAccountIds.length >= 1,
        ].every(Boolean);
    }, []);

    // TODO: Remove code duplication to CreateProfileScreen
    const isValid = useMemo(
        () => isBudgetInProfileValid(budgetInProfile1) && isBudgetInProfileValid(budgetInProfile2),
        [isBudgetInProfileValid, budgetInProfile1, budgetInProfile2],
    );

    // TODO: Remove code duplication to CreateProfileScreen
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
        const profile: Profile = {
            id: profileId,
            budgets: [
                finalizeEditableBudgetInProfile(budgetInProfile1),
                finalizeEditableBudgetInProfile(budgetInProfile2),
            ],
        };
        dispatch(updateProfile({ profile }));
        navigateBack();
    }, [budgetInProfile1, budgetInProfile2, finalizeEditableBudgetInProfile, dispatch, navigateBack, profileId]);

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
