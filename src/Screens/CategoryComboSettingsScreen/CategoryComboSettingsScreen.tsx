import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import CustomScrollView from '../../Component/CustomScrollView';
import LoadingComponent from '../../Component/LoadingComponent';
import { CategoryCombo, CategoryInCategoryCombo, readCategoryCombos, saveCategoryCombos } from '../../Repository/CategoryComboRepository';
import useProfiles from '../../Hooks/useProfiles';
import { Category, getActiveCategories } from '../../YnabApi/YnabApiWrapper';
import CategoryComboCard from './CategoryComboCard';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';

type ScreenName = 'Category Combinations Settings';
type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface EditableCategoryCombo {
    name: string,
    categoryIdFirstProfile?: string,
    categoryIdSecondProfile?: string
}

const CategoryComboSettingsScreen = (props: Props) => {
    const [profiles] = useProfiles();
    const [categoriesFirstProfile, setCategoriesFirstProfile] = useState<Category[]>();
    const [categoriesSecondProfile, setCategoriesSecondProfile] = useState<Category[]>();
    const [categoryCombos, setCategoryCombos] = useState<EditableCategoryCombo[]>([]);

    const everythingLoaded = categoriesFirstProfile !== undefined
        && categoriesSecondProfile !== undefined
        && profiles !== undefined;

    useEffect(() => {
        if (profiles === undefined) {
            return;
        }

        initializeCategories(profiles[0].budgetId, setCategoriesFirstProfile);
        initializeCategories(profiles[1].budgetId, setCategoriesSecondProfile);
    }, [profiles]);

    useEffect(() => {
        readCategoryCombos().then((combos) => {
            const convertedCombos: EditableCategoryCombo[] = [];

            combos.forEach((combo) => {
                if (combo.categories.length !== 2) {
                    throw new Error('Cannot handle category combos of not exactly 2');
                }
                convertedCombos.push({
                    name: combo.name,
                    categoryIdFirstProfile: combo.categories[0].id,
                    categoryIdSecondProfile: combo.categories[1].id
                });
            });

            setCategoryCombos(convertedCombos);
        })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }, []);

    const initializeCategories = (budgetId: string, setCategories: (categories: Category[]) => void) => {
        getActiveCategories(budgetId)
            .then(((categories) => setCategories(categories)))
            .catch((error) => {
                console.error(error);
                throw error;
            });
    };

    return (
        <CustomScrollView>
            {everythingLoaded
                ? <>
                    {categoryCombos.map((categoryCombo, index) => {
                        return <CategoryComboCard
                            key={index}
                            categoryCombo={categoryCombo}
                            setCategoryCombo={(newCategoryCombo) => {
                                const combos = [...categoryCombos];
                                combos[index] = { ...newCategoryCombo };
                                setCategoryCombos(combos);
                            }}
                            profiles={profiles}
                            categoriesFirstProfile={categoriesFirstProfile}
                            categoriesSecondProfile={categoriesSecondProfile}
                            navigation={props.navigation}
                        />;
                    })}
                    <Card>
                        <Button
                            onPress={() => {
                                setCategoryCombos([...categoryCombos, {
                                    name: '',
                                    categoryIdFirstProfile: '',
                                    categoryIdSecondProfile: '',
                                }]);
                            }}>
                            Add
                        </Button>
                        <Button
                            onPress={() => {
                                // TODO: Check if saving is allowed before
                                const categoryCombosToSave: CategoryCombo[] = [];

                                categoryCombos.forEach((combo) => {
                                    if (combo.categoryIdFirstProfile === undefined || combo.categoryIdSecondProfile === undefined) {
                                        throw new Error('Combination is not filled out completely');
                                    }

                                    const categories: CategoryInCategoryCombo[] = [
                                        {
                                            id: combo.categoryIdFirstProfile,
                                            budgetId: profiles[0].budgetId,
                                        },
                                        {
                                            id: combo.categoryIdSecondProfile,
                                            budgetId: profiles[1].budgetId,
                                        },
                                    ];

                                    categoryCombosToSave.push({
                                        name: combo.name,
                                        categories: categories,
                                    });
                                });

                                saveCategoryCombos(categoryCombosToSave);
                            }}>
                            Save
                        </Button>
                    </Card>
                </>
                : <LoadingComponent />}
        </CustomScrollView >
    );
};

export type { MyNavigationProp as Navigation, EditableCategoryCombo };
export default CategoryComboSettingsScreen;
