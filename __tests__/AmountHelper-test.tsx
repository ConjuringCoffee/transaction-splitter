import { convertHumanAmountToApiAmount, reverseNumberFormatSettingsFromLocale } from '../src/Helper/AmountHelper';
import { NumberFormatSettings } from '../src/redux/features/displaySettings/displaySettingsSlice';

const numberFormatSettings: NumberFormatSettings = {
    decimalSeparator: ',',
    digitGroupingSeparator: '.',
};

test('Format settings correctly reversed', () => {
    const given = '100.000,01';
    const actual = reverseNumberFormatSettingsFromLocale(given, numberFormatSettings);
    expect(actual).toBe('100000.01');
});

test('Reversal works with a calculation', () => {
    const given = '1,1+2,1';
    const actual = reverseNumberFormatSettingsFromLocale(given, numberFormatSettings);
    expect(actual).toBe('1.1+2.1');
});

test('No rounding error when converting human to API amount', () => {
    const given = 32.24;
    const actual = convertHumanAmountToApiAmount(given);
    expect(actual).toBe(-32240);
});
