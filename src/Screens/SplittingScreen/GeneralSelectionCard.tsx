import { Card, Datepicker, Icon, Input, NativeDateService } from '@ui-kitten/components';
import React from 'react';
import { ImageProps, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Props {
    payeeName: string,
    setPayeeName: (name: string) => void,
    date: Date,
    setDate: (date: Date) => void,
    memo: string,
    setMemo: (memo: string) => void
}

const DateIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='calendar' />
);

export const GeneralSelectionCard = (props: Props) => {
    const formatDateService = new NativeDateService('en', { format: 'DD.MM.YYYY' });

    return (
        <Card>
            <TextInput
                label='Payee'
                value={props.payeeName}
                onChangeText={props.setPayeeName}
            />
            <Datepicker
                label='Date'
                date={props.date}
                onSelect={(nextDate) => props.setDate(nextDate)}
                accessoryRight={DateIcon}
                dateService={formatDateService}
                onFocus={() => Keyboard.dismiss()}
            />

            <Input
                label='Memo'
                placeholder='Enter memo'
                value={props.memo}
                onChangeText={(text) => props.setMemo(text)}
            />
        </Card>
    );
};
