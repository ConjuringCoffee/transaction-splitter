import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { Platform } from 'react-native';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { CategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../redux/hooks';
import { selectAllProfiles } from '../../redux/features/profiles/profilesSlice';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { CategoryComboInputView } from '../../Component/CategoryComboInputView';

type ScreenName = 'Edit Category Combo';

const SCREEN_TITLE = 'Edit';
const SCREEN_SUBTITLE = 'Category Combination';

const ICON_MORE = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const ICON_SAVE = 'content-save';

export const EditCategoryComboScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const {
        categoryCombo,
        saveCategoryCombo,
        deleteCategoryCombo,
    } = route.params;

    const profiles = useAppSelector(selectAllProfiles);

    const [name, setName] = useState<string>(categoryCombo?.name ?? '');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(categoryCombo?.categories[0].id);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(categoryCombo?.categories[1].id);
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const [navigateBack] = useNavigateBack(navigation);

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile ? true : false;

    const moreMenu = useCallback(() => {
        const deleteAndNavigate = async () => {
            await deleteCategoryCombo();
            navigateBack();
        };

        return (<Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
                <Appbar.Action
                    icon={ICON_MORE}
                    onPress={() => setMenuVisible(true)}
                    // TODO: The usual color from the Appbar isn't transferred to this action and I don't know how to fix it
                    color='white' />
            } >
            <Menu.Item
                key='delete'
                title="Delete"
                onPress={() => {
                    deleteAndNavigate();
                    setMenuVisible(false);
                }} />
        </Menu >);
    }, [
        menuVisible,
        deleteCategoryCombo,
        setMenuVisible,
        navigateBack,
    ]);

    useLayoutEffect(() => {
        const saveAndNavigate = async (newCategoryCombo: CategoryCombo): Promise<void> => {
            await saveCategoryCombo(newCategoryCombo);
            navigateBack();
        };

        const additions = [
            <Appbar.Action
                key='add'
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
                                budgetId: profiles[0].budgetId,
                                id: categoryIdFirstProfile,
                            },
                            {
                                budgetId: profiles[1].budgetId,
                                id: categoryIdSecondProfile,
                            }],
                    });
                }} />,
            moreMenu(),
        ];

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    subtitle={SCREEN_SUBTITLE}
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
        profiles,
        deleteCategoryCombo,
        moreMenu,
        navigateBack,
        saveCategoryCombo,
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
            setCategoryIdSecondProfile={setCategoryIdSecondProfile} />
    );
};
