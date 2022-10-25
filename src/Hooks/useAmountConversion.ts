import { useCallback } from 'react';
import { reverseNumberFormatSettingsFromLocale } from '../Helper/AmountHelper';
import { selectNumberFormatSettings } from '../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from '../redux/hooks';

type Return = [
    (text: string) => number,
    (number: number) => string,
];

export const useAmountConversion = (): Return => {
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    const convertTextToNumber = useCallback(
        (text: string): number => {
            return Number(reverseNumberFormatSettingsFromLocale(text, numberFormatSettings));
        },
        [numberFormatSettings],
    );

    const convertNumberToText = useCallback(
        (number: number) => number.toString().replace('.', numberFormatSettings.decimalSeparator),
        [numberFormatSettings],
    );

    return [
        convertTextToNumber,
        convertNumberToText,
    ];
};
