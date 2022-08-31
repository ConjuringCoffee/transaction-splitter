import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { List, ListItem } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import LoadingComponent from '../../Component/LoadingComponent';
import { CategoryCombo, readCategoryCombos, saveCategoryCombos } from '../../Repository/CategoryComboRepository';
import useProfiles from '../../Hooks/useProfiles';
import { Category, getActiveCategories } from '../../YnabApi/YnabApiWrapper';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';

type ScreenName = 'Category Combinations Settings';
type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

// interface EditableCategoryCombo {
//     name: string,
//     categoryIdFirstProfile?: string,
//     categoryIdSecondProfile?: string
// }

interface RenderItemProps {
    item: CategoryCombo,
    index: number
}

export const CategoryComboSettingsScreen = (props: Props) => {
    const [profiles] = useProfiles();
    const [categoriesFirstProfile, setCategoriesFirstProfile] = useState<Category[]>();
    const [categoriesSecondProfile, setCategoriesSecondProfile] = useState<Category[]>();
    const [categoryCombos, setCategoryCombos] = useState<CategoryCombo[]>([]);

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
                if (categoriesFirstProfile === undefined || categoriesSecondProfile === undefined) {
                    throw Error('Categories must be initialized');
                }

                props.navigation.navigate(ScreenNames.editCategoryComboScreen, {
                    categoryCombo: item,
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
                })
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
    // <CustomScrollView>
    //     {everythingLoaded
    //         ? <>
    //             {categoryCombos.map((categoryCombo, index) => {
    //                 return <CategoryComboCard
    //                     key={index}
    //                     categoryCombo={categoryCombo}
    //                     setCategoryCombo={(newCategoryCombo) => {
    //                         const combos = [...categoryCombos];
    //                         combos[index] = { ...newCategoryCombo };
    //                         setCategoryCombos(combos);
    //                     }}
    //                     profiles={profiles}
    //                     categoriesFirstProfile={categoriesFirstProfile}
    //                     categoriesSecondProfile={categoriesSecondProfile}
    //                     navigation={props.navigation}
    //                 />;
    //             })}
    //             <Card>
    //                 <Button
    //                     onPress={() => {
    //                         setCategoryCombos([...categoryCombos, {
    //                             name: '',
    //                             categoryIdFirstProfile: '',
    //                             categoryIdSecondProfile: '',
    //                         }]);
    //                     }}>
    //                     Add
    //                 </Button>
    //                 <Button
    //                     onPress={() => {
    //                         // TODO: Check if saving is allowed before
    //                         const categoryCombosToSave: CategoryCombo[] = [];

    //                         categoryCombos.forEach((combo) => {
    //                             if (combo.categoryIdFirstProfile === undefined || combo.categoryIdSecondProfile === undefined) {
    //                                 throw new Error('Combination is not filled out completely');
    //                             }

    //                             const categories: CategoryInCategoryCombo[] = [
    //                                 {
    //                                     id: combo.categoryIdFirstProfile,
    //                                     budgetId: profiles[0].budgetId,
    //                                 },
    //                                 {
    //                                     id: combo.categoryIdSecondProfile,
    //                                     budgetId: profiles[1].budgetId,
    //                                 },
    //                             ];

    //                             categoryCombosToSave.push({
    //                                 name: combo.name,
    //                                 categories: categories,
    //                             });
    //                         });

    //                         saveCategoryCombos(categoryCombosToSave);
    //                     }}>
    //                     Save
    //                 </Button>
    //             </Card>
    //         </>
    //         : <LoadingComponent />}
    // </CustomScrollView >
    // );
};
