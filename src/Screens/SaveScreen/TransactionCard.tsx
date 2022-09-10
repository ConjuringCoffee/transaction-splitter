import { Card, Layout, Text } from '@ui-kitten/components';
import { EvaStatus } from '@ui-kitten/components/devsupport';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { convertAmountToText, convertApiAmountToHumanAmount } from '../../Helper/AmountHelper';
import { BasicData } from '../../Helper/Navigation/ScreenParameters';
import { Account, Budget } from '../../YnabApi/YnabApiWrapper';
import * as ynab from 'ynab';
import { NumberFormatSettings } from '../../Hooks/useLocalization';
import { selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../redux/hooks';

interface TransactionCardProps {
    numberFormatSettings: NumberFormatSettings,
    status: EvaStatus,
    title: string,
    basicData: BasicData,
    saveTransaction: ynab.SaveTransaction,
    budget: Budget,
    transferAccount?: Account
}

interface AmountCardProps {
    numberFormatSettings: NumberFormatSettings,
    memo: string,
    target: string,
    amount: number
}

const AmountCard = (props: AmountCardProps) => {
    return (
        <Card
            style={styles.subTransactionCard}
            header={(cardProps) => {
                if (props.memo !== '') {
                    return (
                        <View {...cardProps}>
                            <Text
                                style={styles.subTransactionMemoText}
                                appearance='hint'>
                                {props.memo}
                            </Text>
                        </View>);
                } else {
                    return <></>;
                }
            }}>
            <Layout style={styles.subTransactionLayout}>
                <Text style={styles.subTransactionText}>
                    {props.target}
                </Text>
                <Text style={styles.subTransactionText}>
                    {convertAmountToText(convertApiAmountToHumanAmount(props.amount), props.numberFormatSettings)}€
                </Text>
            </Layout>
        </ Card>);
};

export const TransactionCard = (props: TransactionCardProps) => {
    const categories = useAppSelector((state) => selectCategories(state, props.budget.id));

    const amountCards = () => {
        if (props.saveTransaction.subtransactions === undefined) {
            if (props.saveTransaction.category_id == undefined) {
                throw new Error('Should not be possible to reach this screen with this kind of data');
            }

            const target = categories[props.saveTransaction.category_id].name;

            return (
                <AmountCard
                    numberFormatSettings={props.numberFormatSettings}
                    memo={''}
                    target={target}
                    amount={props.saveTransaction.amount} />);
        } else {
            return props.saveTransaction.subtransactions?.map((subtransaction, index) => {
                let target: string | undefined;

                if (subtransaction.category_id != undefined) {
                    target = categories[subtransaction.category_id].name;
                } else if (subtransaction.payee_id !== undefined) {
                    target = props.transferAccount?.name;
                }

                if (target === '' || target === undefined) {
                    throw new Error('Should not be possible to reach this screen with this kind of data');
                }

                return (
                    <AmountCard
                        numberFormatSettings={props.numberFormatSettings}
                        key={index}
                        memo={subtransaction.memo ? subtransaction.memo : ''}
                        target={target}
                        amount={subtransaction.amount} />
                );
            });
        }
    };


    return (
        <Card
            status={props.status}
            header={(cardProps) => (
                <View {...cardProps}>
                    <Text category='h5'>{props.title}</Text>
                </View>)}>

            <Card style={styles.dataCard}>
                <Layout style={styles.dataOuterLayout}>
                    <Layout style={styles.dataInnerLayout}>
                        <Text>{props.budget.name}</Text>
                        <Text appearance='hint'>Budget</Text>
                    </Layout>
                    <Layout style={styles.dataInnerLayout}>
                        <Text>{props.budget.accounts.find((account) => account.id === props.saveTransaction.account_id)?.name}</Text>
                        <Text appearance='hint'>Account</Text>
                    </Layout>
                </Layout>
            </Card>

            <Card style={styles.dataCard}>
                <Layout style={styles.dataOuterLayout}>
                    <Layout style={styles.dataInnerLayout}>
                        <Text>{props.basicData.payeeName}</Text>
                        <Text appearance='hint'>Payee</Text>
                    </Layout>
                    <Layout style={styles.dataInnerLayout}>
                        <Text>{props.basicData.memo}</Text>
                        <Text appearance='hint'>Memo</Text>
                    </Layout>
                </Layout>
            </Card>

            {amountCards()}
        </Card>);
};

const styles = StyleSheet.create({
    dataCard: {
        marginVertical: 3,
    },
    dataOuterLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dataInnerLayout: {
        flexBasis: '50%',
    },
    subTransactionCard: {
        marginVertical: 3,
    },
    subTransactionLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subTransactionText: {
        flex: 1,
    },
    subTransactionMemoText: {
        fontStyle: 'italic',
    },
});
