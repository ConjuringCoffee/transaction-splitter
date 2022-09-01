import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, List, ListItem } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import LoadingComponent from '../../Component/LoadingComponent';
import { CategoryCombo, readCategoryCombos, saveCategoryCombos } from '../../Repository/CategoryComboRepository';
import useProfiles from '../../Hooks/useProfiles';
import { Category, getActiveCategories } from '../../YnabApi/YnabApiWrapper';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import CreateIcon from '../../Component/CreateIcon';

type ScreenName = 'Category Combinations Settings';
export type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface RenderItemProps {
    item: CategoryCombo,
    index: number
}

export const CategoryComboSettingsScreen = ({ navigation, route }: Props) => {
    const [profiles] = useProfiles();
    const [categoriesFirstProfile, setCategoriesFirstProfile] = useState<Category[]>();
    const [categoriesSecondProfile, setCategoriesSecondProfile] = useState<Category[]>();
    const [categoryCombos, setCategoryCombos] = useState<CategoryCombo[]>([]);

    const everythingLoaded = categoriesFirstProfile !== undefined
        && categoriesSecondProfile !== undefined
        && profiles !== undefined;

    React.useLayoutEffect(() => {
        if (!everythingLoaded) {
            return;
        }

        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate(ScreenNames.editCategoryComboScreen, {
                            profiles: profiles,
                            categoriesFirstProfile: categoriesFirstProfile,
                            categoriesSecondProfile: categoriesSecondProfile,
                            saveCategoryCombo: async (categoryCombo) => {
                                const newCombos = [...categoryCombos, categoryCombo];

                                setCategoryCombos(newCombos);
                                await saveCategoryCombos(newCombos);
                            }
                        });
                    }}
                    accessoryLeft={CreateIcon}
                    size='small'
                    appearance='outline'>
                    Add
                </Button>
            ),
        });
    }, [everythingLoaded, navigation]);

    useEffect(() => {
        if (profiles === undefined) {
            return;
        }

        initializeCategories(profiles[0].budgetId, setCategoriesFirstProfile);
        initializeCategories(profiles[1].budgetId, setCategoriesSecondProfile);
    }, [profiles]);

    useEffect(() => {
        readCategoryCombos().then(
            combos => setCategoryCombos(combos)
        ).catch((error) => {
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

    const renderItem = ({ item, index }: RenderItemProps) => (
        <ListItem
            title={`${item.name}`}
            onPress={() => {
                if (!everythingLoaded) {
                    throw Error('Initialization was not done yet');
                }

                navigation.navigate(ScreenNames.editCategoryComboScreen, {
                    categoryCombo: item,
                    profiles: profiles,
                    categoriesFirstProfile: categoriesFirstProfile,
                    categoriesSecondProfile: categoriesSecondProfile,
                    saveCategoryCombo: async (categoryCombo) => {
                        const newCombos = [...categoryCombos];
                        newCombos[index] = categoryCombo;

                        setCategoryCombos(newCombos);
                        await saveCategoryCombos(newCombos);
                    },
                    deleteCategoryCombo: async () => {
                        const newCombos = [...categoryCombos];
                        newCombos.splice(index, 1);

                        setCategoryCombos(newCombos);
                        await saveCategoryCombos(newCombos);
                    }
                });
            }}
        />
    )

    return (
        <>
            {
                everythingLoaded ?
                    <List
                        data={categoryCombos}
                        renderItem={renderItem}
                    />
                    : <LoadingComponent />}
        </>
    );
};
