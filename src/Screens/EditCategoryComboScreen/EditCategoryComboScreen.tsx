import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { CategoryCombo } from '../../Repository/CategoryComboRepository';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { Button, TextInput, Text, Portal, FAB, Appbar } from 'react-native-paper';
import { View, StyleSheet, Platform } from 'react-native';

type ScreenName = 'Edit Category Combo';
type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface CategoryLayoutProps {
    profileName: string,
    categories: Category[],
    navigation: MyNavigationProp,
    selectedCategoryId?: string,
    onCategorySelect: (categoryId?: string) => void
}

const CategoryLayout = (props: CategoryLayoutProps) => {
    const categoryName = props.categories.find((c) => c.id === props.selectedCategoryId)?.name;

    return (
        <>
            <Text>
                Category of {props.profileName}
            </Text>
            <Button
                mode="contained"
                onPress={() => {
                    props.navigation.navigate(ScreenNames.categoryScreen, {
                        categories: props.categories,
                        onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                    });
                }}>
                {categoryName}
            </Button>
        </>
    );
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const EditCategoryComboScreen = ({ navigation, route }: Props) => {
    const {
        categoryCombo,
        saveCategoryCombo,
        deleteCategoryCombo,
        profiles,
        categoriesFirstProfile,
        categoriesSecondProfile
    } = route.params;

    const [name, setName] = useState<string>(categoryCombo?.name ?? '');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(categoryCombo?.categories[0].id);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(categoryCombo?.categories[1].id);

    const saveAndNavigate = async (newCategoryCombo: CategoryCombo): Promise<void> => {
        await saveCategoryCombo(newCategoryCombo);
        navigation.goBack();
    }

    const deleteAndNavigate = async (): Promise<void> => {
        if (!deleteCategoryCombo) {
            throw Error('No deletion functionality');
        }

        await deleteCategoryCombo();
        navigation.goBack();
    }

    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile ? true : false;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Edit" subtitle="Category Combination" />
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
                        }} />
                    {deleteCategoryCombo &&
                        <Appbar.Action
                            icon={MORE_ICON}
                            onPress={() => deleteAndNavigate()} />
                    }
                </Appbar.Header>
            ),
        });
    }, [
        navigation,
        readyToSave
    ]);

    return (
        <View style={styles.container}>
            <TextInput
                value={name}
                onChangeText={text => setName(text)}
                label='Category Combination Name' />
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    fab: {
        position: "absolute",
        margin: 25,
        right: 0,
        bottom: 0,
    }
});
