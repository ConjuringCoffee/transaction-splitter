import React, { useLayoutEffect, useState } from 'react';
import { Appbar } from 'react-native-paper';
import { CategoryComboInputView } from '../../../../Component/CategoryComboInputView';
import { NavigationBar } from '../../../../Helper/Navigation/NavigationBar';
import { MyStackScreenProps } from '../../../../Helper/Navigation/ScreenParameters';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { CategoryComboToCreate } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { selectProfiles } from '../../../../redux/features/profiles/profilesSlice';
import { useAppSelector } from '../../../../redux/hooks';

type ScreenName = 'Create Category Combo';

const ICON_SAVE = 'content-save';

const SCREEN_TITLE = 'Add';
const SCREEN_SUBTITLE = 'Category Combination';

export const CreateCategoryComboScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const {
        createCategoryCombo,
    } = route.params;

    const [navigateBack] = useNavigateBack(navigation);
    const profiles = useAppSelector(selectProfiles);

    // TODO: Allow selection of profile
    const profileUsed = profiles[0];

    const [name, setName] = useState<string>('');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(undefined);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(undefined);
    const readyToSave = name.length > 0 && categoryIdFirstProfile && categoryIdSecondProfile ? true : false;

    useLayoutEffect(() => {
        const saveAndNavigate = async (newCategoryCombo: CategoryComboToCreate): Promise<void> => {
            await createCategoryCombo(newCategoryCombo);
            navigateBack();
        };

        const addition = <Appbar.Action
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
                            budgetId: profileUsed.budgets[0].budgetId,
                            id: categoryIdFirstProfile,
                        },
                        {
                            budgetId: profileUsed.budgets[1].budgetId,
                            id: categoryIdSecondProfile,
                        }],
                });
            }} />;


        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    subtitle={SCREEN_SUBTITLE}
                    navigation={navigation}
                    additions={addition}
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
        createCategoryCombo,
        navigateBack,
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
