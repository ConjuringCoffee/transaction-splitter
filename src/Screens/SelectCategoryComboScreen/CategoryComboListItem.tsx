import { useCallback } from 'react';
import { List } from 'react-native-paper';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectCategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';

type Props = {
    categoryComboId: string,
    onSelect: (categoryComboId: string) => void,
}

export const CategoryComboListItem = ({ categoryComboId, onSelect }: Props) => {
    const categoryCombo = useAppSelector((state) => selectCategoryCombo(state, categoryComboId));

    const onPress = useCallback(
        () => onSelect(categoryComboId),
        [onSelect, categoryComboId],
    );

    return (
        <List.Item
            key={categoryCombo.id}
            title={categoryCombo.name}
            onPress={onPress}
        />
    );
};
