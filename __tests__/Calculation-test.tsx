import { NumberFormatSettings } from '../src/Hooks/useLocalization';
import { Calculation } from '../src/Helper/Calculation';

const numberFormatSettings: NumberFormatSettings = {
    decimalSeparator: ',',
    groupingSeparator: '.',
};

const createCalculation = (calculationString: string): Calculation => {
    return new Calculation(calculationString, numberFormatSettings);
};

test('Add single digit after operator', () => {
    const calculation = createCalculation('1+');
    calculation.addDigit(1);
    expect(calculation.getCalculationString()).toBe('1+1');
});

test('Add decimal separator', () => {
    const calculation = createCalculation('1');
    calculation.addDecimalSeparator();
    expect(calculation.getCalculationString()).toBe('1,');
});

test('Add operator +', () => {
    const calculation = createCalculation('1');
    calculation.addOperator('+');
    expect(calculation.getCalculationString()).toBe('1+');
});

test('When last character is an operator, then it is replaced by the new operator', () => {
    const calculation = createCalculation('1+');
    calculation.addOperator('-');
    expect(calculation.getCalculationString()).toBe('1-');
});

test('Decimal separator not added if number already has one somewhere', () => {
    const givenCalculationString = '1,1';
    const calculation = createCalculation(givenCalculationString);
    calculation.addDecimalSeparator();
    expect(calculation.getCalculationString()).toBe(givenCalculationString);
});

test('Decimal separator not added if number after operator already has one somewhere', () => {
    const givenCalculationString = '1,1+2,1';
    const calculation = createCalculation(givenCalculationString);
    calculation.addDecimalSeparator();
    expect(calculation.getCalculationString()).toBe(givenCalculationString);
});

test('Decimal separator not added if number already has one at the end', () => {
    const givenCalculationString = '1,';
    const calculation = createCalculation(givenCalculationString);
    calculation.addDecimalSeparator();
    expect(calculation.getCalculationString()).toBe(givenCalculationString);
});

test('Adding digit when last number is zero replaces the zero', () => {
    const calculation = createCalculation('0');
    calculation.addDigit(1);
    expect(calculation.getCalculationString()).toBe('1');
});

test('Simple calculation', () => {
    const calculation = createCalculation('1+1');
    expect(calculation.getResult()).toBe(2);
});

test('Calculation with decimal separator', () => {
    const calculation = createCalculation('1,1+1');
    expect(calculation.getResult()).toBe(2.1);
});

test('Calculation ignores operator at last character', () => {
    const calculation = createCalculation('1+1+');
    expect(calculation.getResult()).toBe(2);
});

test('Empty calculation has zero as result', () => {
    const calculation = createCalculation('');
    expect(calculation.getResult()).toBe(0);
});

test('Rounding error of eval is avoided', () => {
    const calculation = createCalculation('29,79-0,01');
    expect(calculation.getResult()).toBe(29.78);
});

