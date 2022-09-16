import { Card, Input } from '@ui-kitten/components';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

interface Props {
    payeeName: string,
    setPayeeName: (name: string) => void,
    date: Date,
    setDate: (date: Date) => void,
    memo: string,
    setMemo: (memo: string) => void
}

export const GeneralSelectionCard = (props: Props) => {
    return (
        <Card>
            <TextInput
                label='Payee'
                value={props.payeeName}
                onChangeText={props.setPayeeName}
            />
            <DatePickerInput
                // All locales used must be registered beforehand (see App.tsx)
                locale="de"
                label="Date"
                value={props.date}
                onChange={(date) => {
                    if (date) {
                        props.setDate(date);
                    }
                }}
                inputMode="start" />

            <Input
                label='Memo'
                placeholder='Enter memo'
                value={props.memo}
                onChangeText={(text) => props.setMemo(text)}
            />
        </Card>
    );
};
