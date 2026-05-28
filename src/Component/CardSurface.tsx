import React, { ReactNode } from 'react';
import { Surface } from 'react-native-paper';
import { useTheme } from '../Hooks/useTheme';

type Props = {
    children: ReactNode,
    elevation: 0 | 1 | 2 | 3 | 4 | 5,
}

export const CardSurface = ({ children, elevation }: Props) => {
    const [theme] = useTheme();

    return (
        <Surface
            elevation={elevation}
            style={{ borderRadius: theme.roundness * 3, overflow: 'hidden' }}
        >
            {children}
        </Surface>
    );
};
