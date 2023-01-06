import React, { useCallback, useMemo } from 'react';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { Appbar } from 'react-native-paper';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useEditableBudgetsInProfiles } from '../../../../Hooks/useEditableBudgetsInProfiles';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';

type ScreenName = 'CreateProfile';

const SCREEN_TITLE = 'Add Profile';
const ICON_SAVE = 'check';

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

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                key='save'
                icon={ICON_SAVE}
                disabled={!isValid}
                onPress={saveAndNavigate}
            />
        ),
        [isValid, saveAndNavigate],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

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
