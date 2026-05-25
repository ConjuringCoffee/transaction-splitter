import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text, TextInput } from 'react-native-paper';
import { useTheme } from '../../Hooks/useTheme';

type Props = {
    payerCategoryChosen: boolean,
    debtorCategoryChosen: boolean,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (splitPercent: number) => void,
}

export const SplitPercentInput = ({ setSplitPercentToPayer, ...props }: Props) => {
    const [theme] = useTheme();
    const [textValue, setTextValue] = useState(String(props.splitPercentToPayer ?? 50));

    useEffect(() => {
        setTextValue(String(props.splitPercentToPayer ?? 50));
    }, [props.splitPercentToPayer]);

    const handleSliderChange = useCallback(
        (value: number) => setSplitPercentToPayer(Math.round(value)),
        [setSplitPercentToPayer],
    );

    const handleTextChange = useCallback(
        (text: string) => {
            setTextValue(text);
            const num = Number(text);
            if (!isNaN(num) && num >= 0 && num <= 100) {
                setSplitPercentToPayer(num);
            }
        },
        [setSplitPercentToPayer],
    );

    if (!props.payerCategoryChosen || !props.debtorCategoryChosen) {
        return null;
    }

    return (
        <View style={{ gap: 4 }}>
            <Text variant='labelSmall' style={{ color: theme.colors.onSurfaceVariant }}>
                Split % to payer
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing }}>
                <Slider
                    style={{ flex: 1 }}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={props.splitPercentToPayer ?? 50}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor={theme.colors.primary}
                    thumbTintColor={theme.colors.primary}
                />
                <TextInput
                    value={textValue}
                    onChangeText={handleTextChange}
                    keyboardType='numeric'
                    mode='outlined'
                    dense
                    style={{ width: 88 }}
                    right={<TextInput.Affix text='%' />}
                />
            </View>
        </View>
    );
};
