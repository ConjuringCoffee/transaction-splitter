import { useCallback } from 'react';
import { List } from 'react-native-paper';

type Props = {
    calculation: string,
    selectCalculation: (calculation: string) => void,
    navigateBack: () => void,
}

export const HistoryListItem = ({ calculation, selectCalculation: onSelectCalculation, navigateBack }: Props) => {
    const selectAndNavigateBack = useCallback(
        () => {
            onSelectCalculation(calculation);
            navigateBack();
        },
        [onSelectCalculation, navigateBack, calculation],
    );

    return (
        <List.Item
            title={calculation}
            onPress={selectAndNavigateBack}
        />
    );
};
