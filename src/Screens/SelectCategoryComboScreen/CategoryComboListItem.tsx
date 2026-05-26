import { useCallback } from 'react';
import React from 'react';
import { List } from 'react-native-paper';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectCategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useTheme } from '../../Hooks/useTheme';

const comboIcon = (props: object) => <List.Icon {...props} icon='call-split' style={{ transform: [{ rotate: '270deg' }] }} />;

type Props = {
    categoryComboId: string,
    onSelect: (categoryComboId: string) => void,
}

export const CategoryComboListItem = ({ categoryComboId, onSelect }: Props) => {
    const categoryCombo = useAppSelector((state) => selectCategoryCombo(state, categoryComboId));
    const [theme] = useTheme();

    const onPress = useCallback(
        () => onSelect(categoryComboId),
        [onSelect, categoryComboId],
    );

    return (
        <List.Item
            key={categoryCombo.id}
            title={categoryCombo.name}
            left={comboIcon}
            onPress={onPress}
            style={{ paddingHorizontal: theme.spacing }}
        />
    );
};
