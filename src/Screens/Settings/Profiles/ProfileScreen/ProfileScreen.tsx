import React, { useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { Appbar } from 'react-native-paper';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useEditableBudgetsInProfiles } from '../../../../Hooks/useEditableBudgetsInProfiles';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';
import { useTheme } from '../../../../Hooks/useTheme';

type ScreenName = 'Profile';

const SCREEN_TITLE = 'Profile';
const ICON_SAVE = 'check';

export const ProfileScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const [
        budgetInProfile1,
        setBudgetInProfile1,
        budgetInProfile2,
        setBudgetInProfile2,
        isValid,
        save,
    ] = useEditableBudgetsInProfiles();

    const [navigateBack] = useNavigateBack(navigation);
    const [theme] = useTheme();

    const saveAndNavigate = useCallback(async (): Promise<void> => {
        try {
            await save();
            navigateBack();
        } catch {
            Alert.alert('Error', 'Could not save. Please try again.');
        }
    }, [navigateBack, save]);

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
