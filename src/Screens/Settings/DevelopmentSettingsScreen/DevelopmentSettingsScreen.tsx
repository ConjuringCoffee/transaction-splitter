import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { List } from 'react-native-paper';
import { useNavigationBar } from '../../../Hooks/useNavigationBar';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Updates from 'expo-updates';
import { UpdateCheckResult } from 'expo-updates';

type ScreenName = 'DevelopmentSettings';

const SCREEN_TITLE = 'Development Settings';

export const DevelopmentSettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const isDevelopmentMode = __DEV__;

    const [refreshing, setRefreshing] = useState(false);
    const [latestUpdate, setLatestUpdate] = useState<UpdateCheckResult | undefined>(undefined);

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

    const checkForUpdate = useCallback(
        async () => {
            setRefreshing(true);
            const updateResult = await Updates.checkForUpdateAsync();
            setLatestUpdate(updateResult);
            setRefreshing(false);
        },
        [],
    );

    useEffect(
        () => {
            checkForUpdate();
        },
        [checkForUpdate],
    );

    const refreshControl = useMemo(
        () => {
            if (isDevelopmentMode) {
                return undefined;
            }

            return (
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={checkForUpdate}
                />
            );
        },
        [isDevelopmentMode, refreshing, checkForUpdate],
    );

    const updateAvailabilityText = useMemo(
        () => {
            if (isDevelopmentMode) {
                return 'Unavailable in development mode';
            }
            if (!latestUpdate) {
                return 'Loading...';
            }
            if (!latestUpdate.isAvailable) {
                return `Latest version is installed`;
            }

            return 'New version is available - press to install';
        },
        [isDevelopmentMode, latestUpdate],
    );

    const updateApp = useCallback(
        async () => {
            if (isDevelopmentMode) {
                return;
            }

            const update = await Updates.fetchUpdateAsync();

            if (!update.isNew) {
                return;
            }

            Updates.reloadAsync();
        },
        [isDevelopmentMode],
    );

    const onPressUpdate = useMemo(
        () => latestUpdate && latestUpdate.isAvailable ? updateApp : undefined,
        [latestUpdate, updateApp],
    );

    return (
        <ScrollView
            refreshControl={refreshControl}
        >
            <List.Item
                title='Mode'
                description={isDevelopmentMode ? 'Development' : 'Release'}
            />
            <List.Item
                title='Release Channel'
                description={Updates.releaseChannel}
            />
            <List.Item
                title='Date of current update'
                description={Updates.createdAt ? Updates.createdAt.toLocaleString() : 'Unavailable'}
            />
            <List.Item
                title='New update available?'
                description={updateAvailabilityText}
                onPress={onPressUpdate}
            />
        </ScrollView>
    );
};
