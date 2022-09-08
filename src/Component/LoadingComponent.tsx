import { Spinner } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const LoadingComponent = () => {
    return (
        <View style={styles.loading}>
            <Spinner />
        </View>);
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
