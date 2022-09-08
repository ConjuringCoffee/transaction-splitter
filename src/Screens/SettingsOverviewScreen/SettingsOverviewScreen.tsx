import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { List, ListItem } from '@ui-kitten/components';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';

type ScreenName = 'Settings Overview';

type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

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

export const SettingsOverviewScreen = ({ navigation }: Props) => {
    const settingEntries: SettingEntry[] = [
        {
            title: 'Access Token',
            description: 'Necessary to access the YNAB API',
            navigate: () => {
                navigation.navigate(ScreenNames.ACCESS_TOKEN_SCREEN);
            },
        },
        {
            title: 'Profiles',
            description: 'The two profiles to split the transactions to',
            navigate: () => {
                navigation.navigate(ScreenNames.PROFILE_SETTINGS_SCREEN);
            },
        },
        {
            title: 'Category Combinations',
            description: 'Combine categories of your profiles',
            navigate: () => {
                navigation.navigate(ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN);
            },
        },
    ];

    const renderItem = ({ item }: RenderItemProps) => (
        <ListItem
            title={`${item.title}`}
            description={`${item.description}`}
            onPress={() => {
                item.navigate();
            }}
        />
    );

    return (
        <List
            data={settingEntries}
            renderItem={renderItem}
        />
    );
};
