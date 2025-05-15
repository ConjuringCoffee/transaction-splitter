import { NumberFormatSettings } from '../redux/features/displaySettings/displaySettingsSlice';
import { reverseNumberFormatSettingsFromLocale } from './AmountHelper';

class Calculation {
    private calculationString: string;
    private readonly numberFormatSettings: NumberFormatSettings;

    public constructor(calculationString: string, numberFormatSettings: NumberFormatSettings) {
        this.calculationString = calculationString;
        this.numberFormatSettings = numberFormatSettings;
    }

    public getCalculationString(): string {
        return this.calculationString;
    };

    public addDigit(digit: number): void {
        this.calculationString = this.shouldZeroReplace()
            ? `${this.calculationString.slice(0, -1)}${digit}`
            : `${this.calculationString}${digit}`;
    }

    public addDecimalSeparator(): void {
        if (this.canDecimalSeparatorBeAdded()) {
            this.calculationString += this.numberFormatSettings.decimalSeparator;
        }
    }

    public addOperator(operator: string): void {
        let newCalculationString = this.isLastCharacterAnOperator()
            ? this.calculationString.slice(0, -1)
            : this.calculationString;

        newCalculationString += operator;
        this.calculationString = newCalculationString;
    }

    public getResult(): number {
        if (this.calculationString === '') {
            return 0;
        }

        if (this.isLastCharacterAnOperator()) {
            return new Calculation(this.calculationString.slice(0, -1), this.numberFormatSettings).getResult();
        } else {
            // Make sure the eval below can't do anything except addition and subtraction
            // Assume the content of the decimal and grouping separator. If necessary, add additional ones later
            if (!this.calculationString.match(/^[\+\-\.\,0-9]+$/)) {
                throw new Error('Calculation string contains illegal characters');
            }

            const evalResult = eval(reverseNumberFormatSettingsFromLocale(this.calculationString, this.numberFormatSettings));
            // Avoid eval rounding errors, see answer by shawndumas:
            // https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
            return Math.round((evalResult) * 100) / 100;
        }
    }

    private shouldZeroReplace(): boolean {
        const regex = /\d*\.*\d*$/g;
        const result = regex.exec(reverseNumberFormatSettingsFromLocale(this.calculationString, this.numberFormatSettings));

        if (result === null || result.length === 0) {
            return false;
        } else if (result.length !== 1) {
            throw new Error('The regex should not be able to find multiple results');
        } else {
            return result[0] === '0';
        }
    }

    private canDecimalSeparatorBeAdded(): boolean {
        const regex = /(\d*\.\d*$)|([\+\-]$)/g;
        const result = regex.exec(reverseNumberFormatSettingsFromLocale(this.calculationString, this.numberFormatSettings));

        return result === null || result.length === 0;
    }

    private isLastCharacterAnOperator(): boolean {
        const lastCharacter = this.calculationString.slice(-1);
        return lastCharacter === '+' || lastCharacter === '-';
    }
}

const calculateResult = (calculation: string, numberFormatSettings: NumberFormatSettings): number => {
    const cal = new Calculation(calculation, numberFormatSettings);
    return cal.getResult();
};

export { Calculation, calculateResult };
