import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useCallback, useState } from 'react';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { CategoryCombo } from '../../Repository/CategoryComboRepository';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { TextInput, Appbar, List, Button } from 'react-native-paper';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { MyStackNavigationProp, MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';

type ScreenName = 'Edit Category Combo';

interface CategoryLayoutProps {
    profileName: string,
    categories: Category[],
    navigation: MyStackNavigationProp<ScreenName>,
    selectedCategoryId?: string,
    onCategorySelect: (categoryId?: string) => void
}

const CategoryLayout = (props: CategoryLayoutProps) => {
    const categoryName = props.categories.find((c) => c.id === props.selectedCategoryId)?.name;

    return (
        <List.Item
            title={categoryName ?? 'None'}
            description={`Category from ${props.profileName}`}
            left={props => <List.Icon {...props} icon={categoryName ? 'check-circle-outline' : 'checkbox-blank-circle-outline'} />}
            onPress={() => {
                props.navigation.navigate(ScreenNames.categoryScreen, {
                    categories: props.categories,
                    onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                });
            }}
        />
    );
};

const moreIconName = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const EditCategoryComboScreen = (props: MyStackScreenProps<ScreenName>) => {
    const {
        categoryCombo,
        saveCategoryCombo,
        deleteCategoryCombo,
        profiles,
        categoriesFirstProfile,
        categoriesSecondProfile
    } = props.route.params;

    const { navigation } = props;

    const [name, setName] = useState<string>(categoryCombo?.name ?? '');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(categoryCombo?.categories[0].id);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(categoryCombo?.categories[1].id);

    const saveAndNavigate = useCallback(async (newCategoryCombo: CategoryCombo): Promise<void> => {
        await saveCategoryCombo(newCategoryCombo);
        navigation.goBack();
    }, [
        navigation,
        saveCategoryCombo
    ]);

    const deleteAndNavigate = useCallback(async () => {
        if (!deleteCategoryCombo) {
            throw Error('No deletion functionality');
        }

        await deleteCategoryCombo();
        navigation.goBack();
    }, [
        navigation,
        deleteCategoryCombo
    ]);

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile ? true : false;

    const deleteAction = useCallback(() => {
        return deleteCategoryCombo ?
            <Appbar.Action
                icon={moreIconName}
                onPress={() => deleteAndNavigate()} />
            : null;
    }, [
        deleteCategoryCombo,
        deleteAndNavigate
    ]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={'Edit'}
                    subtitle={'Category Setting'}
                    navigation={props.navigation}
                    additions={
                        [
                            <Appbar.Action
                                icon="content-save"
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
                            deleteAction()
                        ]
                    }
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
        moreIconName,
        deleteCategoryCombo,
        saveAndNavigate,
        deleteAction
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
                    categories={categoriesFirstProfile}
                    navigation={navigation}
                    selectedCategoryId={categoryIdFirstProfile}
                    onCategorySelect={categoryId => setCategoryIdFirstProfile(categoryId)} />
                <CategoryLayout
                    profileName={profiles[1].name}
                    categories={categoriesSecondProfile}
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
