import React, { useCallback } from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text, TextInput } from 'react-native-paper';
import { useTheme } from '../../Hooks/useTheme';
import { isSplitPercentInvalid } from '../../Helper/SplitPercentHelper';

type Props = {
    payerCategoryChosen: boolean,
    debtorCategoryChosen: boolean,
    splitPercentToPayerText: string | undefined,
    setSplitPercentToPayerText: (text: string) => void,
}

export const SplitPercentInput = ({ setSplitPercentToPayerText, ...props }: Props) => {
    const [theme] = useTheme();

    const handleSliderChange = useCallback(
        (value: number) => setSplitPercentToPayerText(String(Math.round(value))),
        [setSplitPercentToPayerText],
    );

    if (!props.payerCategoryChosen || !props.debtorCategoryChosen) {
        return null;
    }

    const sliderValue = Number(props.splitPercentToPayerText);
    const sliderValueValid = !Number.isNaN(sliderValue);
    const isInvalid = isSplitPercentInvalid(props.splitPercentToPayerText);

    return (
        <View style={{ gap: 4 }}>
            <Text variant='labelSmall' style={{ color: theme.colors.onSurfaceVariant }}>
                Split % to payer
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing }}>
                <View style={{ flex: 1 }}>
                    {sliderValueValid && (
                        <Slider
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={sliderValue}
                            onValueChange={handleSliderChange}
                            minimumTrackTintColor={theme.colors.primary}
                            thumbTintColor={theme.colors.primary}
                        />
                    )}
                </View>
                <TextInput
                    value={props.splitPercentToPayerText ?? ''}
                    onChangeText={setSplitPercentToPayerText}
                    keyboardType='numeric'
                    mode='outlined'
                    dense
                    style={{ width: 88 }}
                    right={<TextInput.Affix text='%' />}
                    error={isInvalid}
                />
            </View>
        </View>
    );
};
