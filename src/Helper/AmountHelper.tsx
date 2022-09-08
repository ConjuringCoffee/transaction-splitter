import { NumberFormatSettings } from '../Hooks/useLocalization';

export interface DividedAmount {
    dividedAmount: number
    remainingAmount: number,
}

export const reverseNumberFormatSettingsFromLocale = (text: string, numberFormatSettings: NumberFormatSettings): string => {
    return text
        .replace(new RegExp(`\\${numberFormatSettings.groupingSeparator}`, 'g'), '')
        .replace(new RegExp(`\\${numberFormatSettings.decimalSeparator}`, 'g'), '.');
};

export const convertAmountFromText = (text: string, numberFormatSettings: NumberFormatSettings): number => {
    return Number(reverseNumberFormatSettingsFromLocale(text, numberFormatSettings));
};

export const convertAmountToText = (amount: number, numberFormatSettings: NumberFormatSettings): string => {
    return amount.toString().replace('.', numberFormatSettings.decimalSeparator);
};

export const convertApiAmountToHumanAmount = (amount: number): number => {
    return amount / -1000;
};

export const convertHumanAmountToApiAmount = (amount: number): number => {
    // API amounts must be integers
    return Math.round(amount * -1000);
};

const roundToTwoHumanDecimalPlaces = (toRound: number): number => {
    const humanNumber = convertApiAmountToHumanAmount(toRound);
    const humanRounded = roundToTwoDecimalPlaces(humanNumber);
    return convertHumanAmountToApiAmount(humanRounded);
};

const roundToTwoDecimalPlaces = (toRound: number): number => {
    return Math.round((toRound + Number.EPSILON) * 100) / 100;
};

export const divideApiAmount = (amount: number, dividedBy: number): DividedAmount => {
    const result = roundToTwoHumanDecimalPlaces(amount / dividedBy);

    return {
        dividedAmount: result,
        remainingAmount: roundToTwoHumanDecimalPlaces(amount - result),
    };
};
