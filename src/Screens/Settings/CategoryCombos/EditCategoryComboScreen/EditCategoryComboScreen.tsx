import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { NavigationBar } from '../../../../Navigation/NavigationBar';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { CategoryCombo, deleteCategoryCombo, updateCategoryCombo } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../../../Hooks/useAppSelector';
import { selectProfiles } from '../../../../redux/features/profiles/profilesSlice';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { CategoryComboInputView } from '../CategoryComboInputView';
import { AppBarMoreMenu } from '../../../../Component/AppBarMoreMenu';
import { useAppDispatch } from '../../../../Hooks/useAppDispatch';

type ScreenName = 'Edit Category Combo';

const SCREEN_TITLE = 'Edit Category Combo';

const ICON_SAVE = 'content-save';

export const EditCategoryComboScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();
    const { categoryCombo } = route.params;

    const profiles = useAppSelector(selectProfiles);

    // TODO: Allow selection of profile
    const profileUsed = profiles[0];

    const [name, setName] = useState<string>(categoryCombo?.name ?? '');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(categoryCombo?.categories[0].id);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(categoryCombo?.categories[1].id);
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const [navigateBack] = useNavigateBack(navigation);

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile ? true : false;

    const moreMenu = useCallback(() => {
        const deleteAndNavigate = async () => {
            dispatch(deleteCategoryCombo(categoryCombo.id));
            navigateBack();
        };

        return (
            <AppBarMoreMenu
                key='more'
                visible={menuVisible}
                setVisible={setMenuVisible}
            >
                <Menu.Item
                    title="Delete"
                    onPress={() => {
                        deleteAndNavigate();
                        setMenuVisible(false);
                    }}
                />
            </AppBarMoreMenu>);
    }, [
        dispatch,
        navigateBack,
        menuVisible,
        categoryCombo,
    ]);

    useLayoutEffect(() => {
        const saveAndNavigate = async (newCategoryCombo: CategoryCombo): Promise<void> => {
            dispatch(updateCategoryCombo({ categoryCombo: newCategoryCombo }));
            navigateBack();
        };

        const additions = [
            <Appbar.Action
                key='save'
                icon={ICON_SAVE}
                disabled={!readyToSave}
                onPress={() => {
                    if (!categoryIdFirstProfile || !categoryIdSecondProfile) {
                        throw new Error('Not ready to save yet');
                    }

                    saveAndNavigate({
                        id: categoryCombo.id,
                        name: name,
                        categories: [
                            {
                                budgetId: profileUsed.budgets[0].budgetId,
                                id: categoryIdFirstProfile,
                            },
                            {
                                budgetId: profileUsed.budgets[1].budgetId,
                                id: categoryIdSecondProfile,
                            }],
                    });
                }}
            />,
            moreMenu(),
        ];

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={navigation}
                    additions={additions}
                />
            ),
        });
    }, [
        navigation,
        readyToSave,
        name,
        categoryIdFirstProfile,
        categoryIdSecondProfile,
        profileUsed,
        moreMenu,
        navigateBack,
        dispatch,
        categoryCombo.id,
    ]);

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
