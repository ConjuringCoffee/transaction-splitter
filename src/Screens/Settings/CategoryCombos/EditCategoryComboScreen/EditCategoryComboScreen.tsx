import React, { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { deleteCategoryCombo, updateCategoryCombo } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../../../Hooks/useAppSelector';
import { selectProfile } from '../../../../redux/features/profile/profileSlice';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { CategoryComboInputView } from '../CategoryComboInputView';
import { AppBarMoreMenu } from '../../../../Component/AppBarMoreMenu';
import { useThrowingDispatch } from '../../../../Hooks/useThrowingDispatch';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';
import { useTheme } from '../../../../Hooks/useTheme';

type ScreenName = 'Edit Category Combo';

const SCREEN_TITLE = 'Edit Cat. Combo';

const ICON_SAVE = 'check';

export const EditCategoryComboScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const throwingDispatch = useThrowingDispatch();
    const { categoryCombo } = route.params;

    const profile = useAppSelector(selectProfile);
    const budgets = profile!.budgets;

    const [name, setName] = useState<string>(categoryCombo?.name ?? '');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(categoryCombo?.categories[0].id);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(categoryCombo?.categories[1].id);
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const [navigateBack] = useNavigateBack(navigation);
    const [theme] = useTheme();

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile;

    const onSelectDeletion = useCallback(
        async (): Promise<void> => {
            try {
                await throwingDispatch(deleteCategoryCombo(categoryCombo.id));
                setMenuVisible(false);
                navigateBack();
            } catch {
                Alert.alert('Error', 'Could not delete. Please try again.');
            }
        },
        [categoryCombo.id, throwingDispatch, navigateBack],
    );

    const moreMenu = useMemo(
        () => (
            <AppBarMoreMenu
                key='more'
                visible={menuVisible}
                setVisible={setMenuVisible}
            >
                <Menu.Item
                    title="Delete"
                    onPress={onSelectDeletion}
                />
            </AppBarMoreMenu>
        ),
        [menuVisible, onSelectDeletion],
    );

    const saveAndNavigate = useCallback(
        async () => {
            if (!categoryIdFirstProfile || !categoryIdSecondProfile) {
                throw new Error('Not ready to save yet');
            }

            try {
                await throwingDispatch(updateCategoryCombo(
                    {
                        categoryCombo: {
                            id: categoryCombo.id,
                            name: name,
                            categories: [
                                {
                                    budgetId: budgets[0].budgetId,
                                    id: categoryIdFirstProfile,
                                },
                                {
                                    budgetId: budgets[1].budgetId,
                                    id: categoryIdSecondProfile,
                                }],
                        },
                    },
                ));
                navigateBack();
            } catch {
                Alert.alert('Error', 'Could not save. Please try again.');
            }
        },
        [categoryCombo.id, categoryIdFirstProfile, categoryIdSecondProfile, throwingDispatch, name, navigateBack, budgets],
    );

    const navigationBarAdditions = useMemo(
        () => (
            [
                <Appbar.Action
                    key='save'
                    icon={ICON_SAVE}
                    iconColor={theme.colors.onPrimary}
                    disabled={!readyToSave}
                    onPress={saveAndNavigate}
                />,
                moreMenu,
            ]
        ),
        [moreMenu, readyToSave, saveAndNavigate, theme],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAdditions,
    });

    return (
        <CategoryComboInputView
            navigation={navigation}
            name={name}
            setName={setName}
            categoryIdFirstProfile={categoryIdFirstProfile}
            setCategoryIdFirstProfile={setCategoryIdFirstProfile}
            categoryIdSecondProfile={categoryIdSecondProfile}
            setCategoryIdSecondProfile={setCategoryIdSecondProfile}
        />
    );
};
