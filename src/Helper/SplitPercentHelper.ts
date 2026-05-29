export const isSplitPercentInvalid = (splitPercentToPayerText: string | undefined): boolean => {
    const splitPercent = Number(splitPercentToPayerText);
    return splitPercentToPayerText === undefined
        || Number.isNaN(splitPercent)
        || splitPercent < 0
        || splitPercent > 100;
};
