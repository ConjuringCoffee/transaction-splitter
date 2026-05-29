import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { children: ReactNode };
type State = { hasError: boolean; errorName: string | null };

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false, errorName: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorName: error.name };
    }

    componentDidCatch(error: Error) {
        console.error('Unhandled error:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.body}>Please restart the app to continue.</Text>
                    {this.state.errorName !== null && (
                        <Text style={styles.errorName}>{this.state.errorName}</Text>
                    )}
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    body: {
        fontSize: 16,
        textAlign: 'center',
        color: '#444',
        marginBottom: 24,
    },
    errorName: {
        fontSize: 13,
        color: '#999',
    },
});
