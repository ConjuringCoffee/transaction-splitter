import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { MyStackScreenProps } from '../../../../Helper/Navigation/ScreenParameters';
import { useImmer } from 'use-immer';
import { ProfileBudgetInputSection } from '../ProfileBudgetInputSection';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../../../Helper/Navigation/NavigationBar';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useAppDispatch } from '../../../../redux/hooks';

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
    // TODO: Convert these into a single tuple state
    const [budgetInProfile1, setBudgetInProfile1] = useImmer<EditableBudgetInProfile>({ elegibleAccountIds: [] });
    const [budgetInProfile2, setBudgetInProfile2] = useImmer<EditableBudgetInProfile>({ elegibleAccountIds: [] });

    const dispatch = useAppDispatch();
    const [navigateBack] = useNavigateBack(navigation);

    const isBudgetInProfileValid = useCallback((budgetInProfile: EditableBudgetInProfile): boolean => {
        return [budgetInProfile.budgetId, budgetInProfile.debtorAccountId, budgetInProfile.elegibleAccountIds.length >= 1].every(Boolean);
    }, []);

    const isValid = useMemo(() => {
        return isBudgetInProfileValid(budgetInProfile1) && isBudgetInProfileValid(budgetInProfile2);
    }, [isBudgetInProfileValid, budgetInProfile1, budgetInProfile2]);

    useLayoutEffect(() => {
        // const saveAndNavigate = async (newProfile: ProfileToCreate): Promise<void> => {
        //     dispatch(addProfile(newProfile));
        //     navigateBack();
        // };

        const addition = <Appbar.Action
            key='add'
            icon={ICON_SAVE}
            disabled={!isValid}
            onPress={() => {
                // FIXME
            }} />;

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={navigation}
                    additions={addition}
                />
            ),
        });
    }, [navigation, navigateBack, dispatch, isValid]);

    return (
        <CustomScrollView>
            <ProfileBudgetInputSection
                editableBudgetInProfile={budgetInProfile1}
                setEditableBudgetInProfile={setBudgetInProfile1}
            />
            <ProfileBudgetInputSection
                editableBudgetInProfile={budgetInProfile2}
                setEditableBudgetInProfile={setBudgetInProfile2}
            />
        </CustomScrollView>
    );
};
