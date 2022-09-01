import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card, Input, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { CategoryCombo } from '../../Repository/CategoryComboRepository';
import { Category } from '../../YnabApi/YnabApiWrapper';

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
        <Layout>
            <Text>
                Category of {props.profileName}
            </Text>
            <Button
                onPress={() => {
                    props.navigation.navigate(ScreenNames.categoryScreen, {
                        categories: props.categories,
                        onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                    });
                }}>
                {categoryName}
            </Button>
        </Layout>
    );
};

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
        await deleteCategoryCombo();
        navigation.goBack();
    }

    return <>
        <Card>
            <Input
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
        </Card>
        <Card>
            <Button
                onPress={() => {
                    if (categoryIdFirstProfile && categoryIdSecondProfile) {
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
                    }
                }}>
                Save
            </Button>
        </Card>
        <Card>
            <Button
                onPress={() => deleteAndNavigate()}>
                Delete
            </Button>
        </Card>
    </>
}
