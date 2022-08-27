import React from 'react';
import { RouteConfig, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplittingScreenStackParameterList } from "../../Helper/Navigation/ScreenParameters";
import { List, ListItem } from '@ui-kitten/components';
import { nameAccessTokenScreen, nameCategoryComboSettingsScreen, nameProfileSettingsScreen } from '../../Helper/Navigation/ScreenNames';

type ScreenName = 'Settings Overview';

type MyNavigationProp = StackNavigationProp<SplittingScreenStackParameterList, ScreenName>;
type MyRouteProp = RouteProp<SplittingScreenStackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface SettingEntry {
    title: string,
    description: string,
    navigate: () => void
}

interface RenderItemProps {
    item: SettingEntry,
    index: number
}

const SettingsOverviewScreen = ({ navigation }: Props) => {
    const settingEntries: SettingEntry[] = [
        {
            title: 'Access Token',
            description: 'Necessary to access the YNAB API',
            navigate: () => { navigation.navigate(nameAccessTokenScreen) }
        },
        {
            title: 'Profiles',
            description: 'The two profiles to split the transactions to',
            navigate: () => { navigation.navigate(nameProfileSettingsScreen) }
        },
        {
            title: 'Category Combinations',
            description: 'Combine categories of your profiles',
            navigate: () => { navigation.navigate(nameCategoryComboSettingsScreen) }
        }
    ]

    const renderItem = ({ item }: RenderItemProps) => (
        <ListItem
            title={`${item.title}`}
            description={`${item.description}`}
            onPress={() => { item.navigate() }}
        />
    )

    return (
        <List
            data={settingEntries}
            renderItem={renderItem}
        />
    )
}

export default SettingsOverviewScreen;
