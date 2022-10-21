import React, { useCallback, useLayoutEffect } from 'react';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { MyStackScreenProps } from '../../../../Helper/Navigation/ScreenParameters';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../../../Helper/Navigation/NavigationBar';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useEditableBudgetsInProfiles } from '../../../../Hooks/useEditableBudgetsInProfiles';

type ScreenName = 'EditProfile';

const SCREEN_TITLE = 'Edit Profile';
const ICON_SAVE = 'content-save';

export const EditProfileScreen = (props: MyStackScreenProps<ScreenName>) => {
    const { navigation } = props;
    const { profileId } = props.route.params;

    const [
        budgetInProfile1,
        setBudgetInProfile1,
        budgetInProfile2,
        setBudgetInProfile2,
        isValid,
        save,
    ] = useEditableBudgetsInProfiles(profileId);

    const [navigateBack] = useNavigateBack(navigation);

    const saveAndNavigate = useCallback(async (): Promise<void> => {
        save();
        navigateBack();
    }, [navigateBack, save]);

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
