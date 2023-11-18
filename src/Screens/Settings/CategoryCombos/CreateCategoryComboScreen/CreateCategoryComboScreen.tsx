import React, { useCallback, useMemo, useState } from 'react';
import { Appbar } from 'react-native-paper';
import { CategoryComboInputView } from '../CategoryComboInputView';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { addCategoryCombo } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { selectProfiles } from '../../../../redux/features/profiles/profilesSlice';
import { useAppSelector } from '../../../../Hooks/useAppSelector';
import { useAppDispatch } from '../../../../Hooks/useAppDispatch';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';

type ScreenName = 'Create Category Combo';

const ICON_SAVE = 'check';

const SCREEN_TITLE = 'Create';

export const CreateCategoryComboScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();
    const [navigateBack] = useNavigateBack(navigation);
    const profiles = useAppSelector(selectProfiles);

    // TODO: Allow selection of profile
    const profileUsed = profiles[0];

    const [name, setName] = useState<string>('');
    const [categoryIdFirstProfile, setCategoryIdFirstProfile] = useState<string | undefined>(undefined);
    const [categoryIdSecondProfile, setCategoryIdSecondProfile] = useState<string | undefined>(undefined);
    const readyToSave = name.length > 0 && categoryIdFirstProfile;

    const saveAndNavigate = useCallback(
        () => {
            if (!categoryIdFirstProfile || !categoryIdSecondProfile) {
                throw new Error('Not ready to save yet');
            }

            dispatch(addCategoryCombo({
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
            }));
            navigateBack();
        },
        [categoryIdFirstProfile, categoryIdSecondProfile, dispatch, name, navigateBack, profileUsed.budgets],
    );

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                key='add'
                icon={ICON_SAVE}
                disabled={!readyToSave}
                onPress={saveAndNavigate}
            />
        ),
        [readyToSave, saveAndNavigate],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    return (
        <CategoryComboInputView
            navigation={navigation}
            name={name}
            setName={setName}
            categoryIdFirstProfile={categoryIdFirstProfile}
            setCategoryIdFirstProfile={setCategoryIdFirstProfile}
            categoryIdSecondProfile={categoryIdSecondProfile}
            setCategoryIdSecondProfile={setCategoryIdSecondProfile}
        />
    );
};
