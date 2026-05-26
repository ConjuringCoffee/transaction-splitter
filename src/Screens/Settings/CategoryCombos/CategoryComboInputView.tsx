import React from 'react';
import { View } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';
import { MyStackNavigationProp, StackParameterList } from '../../../Navigation/ScreenParameters';
import { selectProfile } from '../../../redux/features/profile/profileSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { ChooseCategoryListItem } from './ChooseCategoryListItem';
import { CustomScrollView } from '../../../Component/CustomScrollView';
import { useTheme } from '../../../Hooks/useTheme';

type Props<T extends keyof StackParameterList> = {
    navigation: MyStackNavigationProp<T>,
    name: string,
    setName: (name: string) => void,
    categoryIdFirstProfile?: string,
    setCategoryIdFirstProfile: (categoryId?: string) => void,
    categoryIdSecondProfile?: string,
    setCategoryIdSecondProfile: (categoryId?: string) => void,
}

export const CategoryComboInputView = <T extends keyof StackParameterList>(props: Props<T>) => {
    const profile = useAppSelector(selectProfile);
    const [theme] = useTheme();

    const cardStyle = {
        borderRadius: theme.roundness * 3,
        overflow: 'hidden' as const,
    };

    return (
        <CustomScrollView>
            <View style={{ gap: theme.spacing }}>
                <TextInput
                    value={props.name}
                    onChangeText={props.setName}
                    label='Category Combination Name'
                    mode='outlined'
                />
                <Surface elevation={1} style={cardStyle}>
                    <ChooseCategoryListItem
                        budgetId={profile!.budgets[0].budgetId}
                        budgetDisplayName={profile!.budgets[0].name}
                        navigation={props.navigation}
                        selectedCategoryId={props.categoryIdFirstProfile}
                        onCategorySelect={props.setCategoryIdFirstProfile}
                    />
                    <ChooseCategoryListItem
                        budgetId={profile!.budgets[1].budgetId}
                        budgetDisplayName={profile!.budgets[1].name}
                        navigation={props.navigation}
                        selectedCategoryId={props.categoryIdSecondProfile}
                        onCategorySelect={props.setCategoryIdSecondProfile}
                    />
                </Surface>
            </View>
        </CustomScrollView>
    );
};
