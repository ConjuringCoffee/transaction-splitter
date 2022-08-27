import * as Localization from 'expo-localization';
import { useEffect, useState } from 'react';

interface NumberFormatSettings {
    decimalSeparator: string,
    groupingSeparator: string,
}

interface Return {
    numberFormatSettings?: NumberFormatSettings,
}

const useLocalization = (): Return => {
    const [numberFormatSettings, setNumberFormatSettings] = useState<NumberFormatSettings>();

    useEffect(() => {
        Localization.getLocalizationAsync()
            .then((localization) => setNumberFormatSettings({
                decimalSeparator: localization.decimalSeparator,
                groupingSeparator: localization.digitGroupingSeparator,
            }));
    }, []);

    return {
        numberFormatSettings: numberFormatSettings,
    };
};

export type { NumberFormatSettings };
export default useLocalization;
