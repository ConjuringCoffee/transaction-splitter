import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import { MyStackNavigationProp, StackParameterList } from '../Helper/Navigation/ScreenParameters';
import { selectAllProfiles } from '../redux/features/profiles/profilesSlice';
import { useAppSelector } from '../redux/hooks';
import { ChooseCategoryListItem } from './ChooseCategoryListItem';

interface Props<T extends keyof StackParameterList> {
    navigation: MyStackNavigationProp<T>,
    name: string,
    setName: (name: string) => void,
    categoryIdFirstProfile?: string,
    setCategoryIdFirstProfile: (categoryId?: string) => void,
    categoryIdSecondProfile?: string,
    setCategoryIdSecondProfile: (categoryId?: string) => void,
}

export const CategoryComboInputView = <T extends keyof StackParameterList>(props: Props<T>) => {
    const profiles = useAppSelector(selectAllProfiles);

    return (<View>
        <TextInput
            value={props.name}
            onChangeText={props.setName}
            style={styles.input}
            label='Category Combination Name' />
        <List.Section>
            <List.Subheader>Categories</List.Subheader>
            <ChooseCategoryListItem
                profileName={profiles[0].name}
                budgetId={profiles[0].budgetId}
                navigation={props.navigation}
                selectedCategoryId={props.categoryIdFirstProfile}
                onCategorySelect={props.setCategoryIdFirstProfile} />
            <ChooseCategoryListItem
                profileName={profiles[1].name}
                budgetId={profiles[1].budgetId}
                navigation={props.navigation}
                selectedCategoryId={props.categoryIdSecondProfile}
                onCategorySelect={props.setCategoryIdSecondProfile} />
        </List.Section>
    </View>);
};

const styles = StyleSheet.create({
    input: {
        margin: 8,
    },
});
