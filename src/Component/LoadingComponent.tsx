import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export const LoadingComponent = () => {
    return (
        <View style={styles.loading}>
            <ActivityIndicator />
        </View>);
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
