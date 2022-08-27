import { Button, Card, Input, Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { nameCategoryScreen } from '../../Helper/Navigation/ScreenNames';
import { Profile } from '../../Repository/ProfileRepository';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { EditableCategoryCombo, Navigation } from './CategoryComboSettingsScreen';

interface Props {
    key: number,
    categoryCombo: EditableCategoryCombo,
    setCategoryCombo: (categoryCombo: EditableCategoryCombo) => void,
    profiles: [Profile, Profile]
    categoriesFirstProfile: Category[],
    categoriesSecondProfile: Category[],
    navigation: Navigation
}

interface CategoryLayoutProps {
    profileName: string,
    categories: Category[],
    navigation: Navigation,
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
                    props.navigation.navigate(nameCategoryScreen, {
                        categories: props.categories,
                        onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                    });
                }}>
                {categoryName}
            </Button>
        </Layout>
    );
};

const CategoryComboCard = (props: Props) => {
    return (
        <Card>
            <Input
                value={props.categoryCombo.name}
                onChangeText={(text) => {
                    const newCombo = props.categoryCombo;
                    newCombo.name = text;
                    props.setCategoryCombo(newCombo);
                }}
                label='Category Combination Name' />
            <CategoryLayout
                profileName={props.profiles[0].name}
                categories={props.categoriesFirstProfile}
                navigation={props.navigation}
                selectedCategoryId={props.categoryCombo.categoryIdFirstProfile}
                onCategorySelect={(categoryId) => {
                    const newCombo = props.categoryCombo;
                    newCombo.categoryIdFirstProfile = categoryId;
                    props.setCategoryCombo(newCombo);
                }} />
            <CategoryLayout
                profileName={props.profiles[1].name}
                categories={props.categoriesSecondProfile}
                navigation={props.navigation}
                selectedCategoryId={props.categoryCombo.categoryIdSecondProfile}
                onCategorySelect={(categoryId) => {
                    const newCombo = props.categoryCombo;
                    newCombo.categoryIdSecondProfile = categoryId;
                    props.setCategoryCombo(newCombo);
                }} />
        </Card>
    );
};

export default CategoryComboCard;
