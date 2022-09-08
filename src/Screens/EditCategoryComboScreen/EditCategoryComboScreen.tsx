import React, { useCallback, useState } from 'react';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { TextInput, Appbar, List, Menu } from 'react-native-paper';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { MyStackNavigationProp, MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { CategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { CommonActions } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';
import { selectActiveCategories } from '../../redux/features/ynab/ynabSlice';
import { selectAllProfiles } from '../../redux/features/profiles/profilesSlice';

type ScreenName = 'Edit Category Combo';

const SCREEN_TITLE = 'Edit';
const SCREEN_SUBTITLE = 'Category Combination';

const ICON_MORE = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const ICON_SAVE = 'content-save';
const ICON_CATEGORY_SET = 'check-circle-outline';
const ICON_CATEGORY_NOT_SET = 'checkbox-blank-circle-outline';

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

    const navigateBack = () => {
        // This prevents multiple fast button presses to navigate back multiple times
        // Source: https://github.com/react-navigation/react-navigation/issues/6864#issuecomment-635686686
        navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
    }

    const saveAndNavigate = async (newCategoryCombo: CategoryCombo): Promise<void> => {
        await saveCategoryCombo(newCategoryCombo);
        navigateBack();
    };

    const deleteAndNavigate = async () => {
        if (!deleteCategoryCombo) {
            throw new Error('You were not supposed to be able to call this function');
        }

        await deleteCategoryCombo();
        navigateBack();
    };

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile ? true : false;

    const moreMenu = useCallback(() => {
        return deleteCategoryCombo ?
            <Menu
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
            </Menu >
            : null;
    }, [
        menuVisible,
        deleteCategoryCombo,
        deleteAndNavigate,
        setMenuVisible,
        ICON_MORE
    ]);

    React.useLayoutEffect(() => {
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
                        name: name,
                        categories: [
                            {
                                budgetId: profiles[0].budgetId,
                                id: categoryIdFirstProfile
                            },
                            {
                                budgetId: profiles[1].budgetId,
                                id: categoryIdSecondProfile
                            }]
                    })
                }} />,
            moreMenu()
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
        saveAndNavigate,
        moreMenu
    ]);

    return (
        <View style={styles.container}>
            <TextInput
                value={name}
                onChangeText={text => setName(text)}
                label='Category Combination Name' />
            <List.Section>
                <List.Subheader>Categories</List.Subheader>
                <CategoryLayout
                    profileName={profiles[0].name}
                    budgetId={profiles[0].budgetId}
                    navigation={navigation}
                    selectedCategoryId={categoryIdFirstProfile}
                    onCategorySelect={categoryId => setCategoryIdFirstProfile(categoryId)} />
                <CategoryLayout
                    profileName={profiles[1].name}
                    budgetId={profiles[1].budgetId}
                    navigation={navigation}
                    selectedCategoryId={categoryIdSecondProfile}
                    onCategorySelect={categoryId => setCategoryIdSecondProfile(categoryId)} />
            </List.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 8
    }
});

interface CategoryLayoutProps {
    profileName: string,
    budgetId: string,
    navigation: MyStackNavigationProp<ScreenName>,
    selectedCategoryId?: string,
    onCategorySelect: (categoryId?: string) => void
}

const CategoryLayout = (props: CategoryLayoutProps) => {
    const categories = useAppSelector((state) => selectActiveCategories(state, props.budgetId));
    const categoryName = categories.find((c) => c.id === props.selectedCategoryId)?.name;

    return (
        <List.Item
            title={categoryName ?? 'None'}
            description={`Category from ${props.profileName}`}
            left={props => <List.Icon {...props} icon={categoryName ? ICON_CATEGORY_SET : ICON_CATEGORY_NOT_SET} />}
            onPress={() => {
                props.navigation.navigate(ScreenNames.categoryScreen, {
                    budgetId: props.budgetId,
                    onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                });
            }}
        />
    );
};