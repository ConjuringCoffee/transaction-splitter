import React, { useCallback, useLayoutEffect } from 'react';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../../../Navigation/NavigationBar';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useEditableBudgetsInProfiles } from '../../../../Hooks/useEditableBudgetsInProfiles';

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
    const [
        budgetInProfile1,
        setBudgetInProfile1,
        budgetInProfile2,
        setBudgetInProfile2,
        isValid,
        save,
    ] = useEditableBudgetsInProfiles();

    const [navigateBack] = useNavigateBack(navigation);

    const saveAndNavigate = useCallback(async (): Promise<void> => {
        save();
        navigateBack();
    }, [navigateBack, save]);

    useLayoutEffect(() => {
        const addition = (
            <Appbar.Action
                key='save'
                icon={ICON_SAVE}
                disabled={!isValid}
                onPress={saveAndNavigate}
            />
        );

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
