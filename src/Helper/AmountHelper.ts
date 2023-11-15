import { NumberFormatSettings } from '../redux/features/displaySettings/displaySettingsSlice';

export type DividedAmount = {
    dividedAmount: number
    remainingAmount: number,
}

export const reverseNumberFormatSettingsFromLocale = (text: string, numberFormatSettings: NumberFormatSettings): string => {
    return text
        .replace(new RegExp(`\\${numberFormatSettings.digitGroupingSeparator}`, 'g'), '')
        .replace(new RegExp(`\\${numberFormatSettings.decimalSeparator}`, 'g'), '.');
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

export const roundToTwoDecimalPlaces = (toRound: number): number => {
    return Math.round((toRound + Number.EPSILON) * 100) / 100;
};

export const divideApiAmount = (amount: number, dividedBy: number): DividedAmount => {
    const result = roundToTwoHumanDecimalPlaces(amount / dividedBy);

    return {
        dividedAmount: result,
        remainingAmount: roundToTwoHumanDecimalPlaces(amount - result),
    };
};
