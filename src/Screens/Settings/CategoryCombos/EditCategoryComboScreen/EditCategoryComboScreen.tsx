import React, { useCallback, useMemo, useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { deleteCategoryCombo, updateCategoryCombo } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../../../Hooks/useAppSelector';
import { selectProfile } from '../../../../redux/features/profile/profileSlice';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { CategoryComboInputView } from '../CategoryComboInputView';
import { AppBarMoreMenu } from '../../../../Component/AppBarMoreMenu';
import { useAppDispatch } from '../../../../Hooks/useAppDispatch';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';

type ScreenName = 'Edit Category Combo';

const SCREEN_TITLE = 'Edit';

const ICON_SAVE = 'check';

export const EditCategoryComboScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();
    const { categoryCombo } = route.params;

    const profile = useAppSelector(selectProfile);
    const budgets = profile!.budgets;

    const [name, setName] = useState<string>(categoryCombo?.name ?? '');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(categoryCombo?.categories[0].id);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(categoryCombo?.categories[1].id);
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const [navigateBack] = useNavigateBack(navigation);

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile;

    const onSelectDeletion = useCallback(
        (): void => {
            dispatch(deleteCategoryCombo(categoryCombo.id));
            setMenuVisible(false);
            navigateBack();
        },
        [categoryCombo.id, dispatch, navigateBack],
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
        () => {
            if (!categoryIdFirstProfile || !categoryIdSecondProfile) {
                throw new Error('Not ready to save yet');
            }

            dispatch(updateCategoryCombo(
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
        },
        [categoryCombo.id, categoryIdFirstProfile, categoryIdSecondProfile, dispatch, name, navigateBack, budgets],
    );

    const navigationBarAdditions = useMemo(
        () => (
            [
                <Appbar.Action
                    key='save'
                    icon={ICON_SAVE}
                    disabled={!readyToSave}
                    onPress={saveAndNavigate}
                />,
                moreMenu,
            ]
        ),
        [moreMenu, readyToSave, saveAndNavigate],
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
