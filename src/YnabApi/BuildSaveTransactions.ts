import { convertHumanAmountToApiAmount, divideApiAmount } from '../Helper/AmountHelper';
import { BasicData } from '../Navigation/ScreenParameters';
import * as ynab from 'ynab';

interface SaveTransactions {
    payer: ynab.SaveTransaction,
    debtor: ynab.SaveTransaction
}

interface AmountEntry {
    amount: number,
    memo: string,
    payerCategoryId?: string,
    debtorCategoryId?: string,
    splitPercentToPayer?: number
}

const collectSaveSubtransaction = (collectedSaveSubTransactions: ynab.SaveSubTransaction[],
    saveSubtransaction: ynab.SaveSubTransaction): void => {
    const index = collectedSaveSubTransactions.findIndex((element) => {
        return element.memo === saveSubtransaction.memo
            && element.category_id === saveSubtransaction.category_id
            && element.payee_id === saveSubtransaction.payee_id;
    });

    if (index !== -1) {
        collectedSaveSubTransactions[index].amount += saveSubtransaction.amount;
    } else {
        collectedSaveSubTransactions.push(saveSubtransaction);
    }
};

const buildSaveTransactions = (amountEntries: AmountEntry[], basicData: BasicData): SaveTransactions => {
    const payerSaveTransaction: ynab.SaveTransaction = {
        account_id: basicData.payer.accountId,
        date: basicData.date,
        amount: 0,
        payee_name: basicData.payeeName,
        memo: basicData.memo,
        subtransactions: [],
        approved: true,
    };

    const debtorSaveTransaction: ynab.SaveTransaction = {
        account_id: basicData.debtor.accountId,
        date: basicData.date,
        amount: 0,
        payee_name: basicData.payeeName,
        memo: basicData.memo,
        subtransactions: [],
        approved: true,
    };

    amountEntries.forEach((amountEntry) => {
        if (payerSaveTransaction.subtransactions == undefined || debtorSaveTransaction.subtransactions == undefined) {
            throw new Error('This should be impossible');
        }

        const apiAmount = convertHumanAmountToApiAmount(amountEntry.amount);

        if (amountEntry.payerCategoryId !== undefined && amountEntry.debtorCategoryId !== undefined) {
            if (amountEntry.splitPercentToPayer === undefined) {
                throw new Error('Split percent to payer must be set');
            }

            const divideBy = 100 / amountEntry.splitPercentToPayer;
            const dividedAmount = divideApiAmount(apiAmount, divideBy);

            collectSaveSubtransaction(
                payerSaveTransaction.subtransactions,
                {
                    amount: dividedAmount.dividedAmount,
                    memo: amountEntry.memo,
                    category_id: amountEntry.payerCategoryId,
                });
            collectSaveSubtransaction(
                payerSaveTransaction.subtransactions,
                {
                    amount: dividedAmount.remainingAmount,
                    memo: amountEntry.memo,
                    payee_id: basicData.payer.transferAccountPayeeId,
                });
            collectSaveSubtransaction(
                debtorSaveTransaction.subtransactions,
                {
                    amount: dividedAmount.remainingAmount,
                    memo: amountEntry.memo,
                    category_id: amountEntry.debtorCategoryId,
                });
        } else if (amountEntry.payerCategoryId !== undefined) {
            collectSaveSubtransaction(
                payerSaveTransaction.subtransactions,
                {
                    amount: apiAmount,
                    memo: amountEntry.memo,
                    category_id: amountEntry.payerCategoryId,
                });
        } else if (amountEntry.debtorCategoryId !== undefined) {
            collectSaveSubtransaction(
                payerSaveTransaction.subtransactions,
                {
                    amount: apiAmount,
                    memo: amountEntry.memo,
                    payee_id: basicData.payer.transferAccountPayeeId,
                });
            collectSaveSubtransaction(
                debtorSaveTransaction.subtransactions,
                {
                    amount: apiAmount,
                    memo: amountEntry.memo,
                    category_id: amountEntry.debtorCategoryId,
                });
        } else {
            throw new Error('Should be impossible to get here');
        }
    });

    payerSaveTransaction.amount = calculateTotalAmount(payerSaveTransaction.subtransactions);
    debtorSaveTransaction.amount = calculateTotalAmount(debtorSaveTransaction.subtransactions);

    const reduceSplitIfNeeded = (saveTransaction: ynab.SaveTransaction): void => {
        if (saveTransaction.subtransactions?.length !== 1) {
            return;
        }

        const saveSubtransaction = saveTransaction.subtransactions[0];
        if (saveSubtransaction.category_id === undefined) {
            throw new Error('This does not make sense');
        }

        if (saveTransaction.memo !== ''
            && saveSubtransaction.memo !== ''
            && saveTransaction.memo !== saveSubtransaction.memo) {
            // Remain as split if memos are different
            return;
        }

        if (saveSubtransaction.memo !== '') {
            saveTransaction.memo = saveSubtransaction.memo;
        }

        saveTransaction.category_id = saveSubtransaction.category_id;
        saveTransaction.subtransactions = undefined;
    };

    reduceSplitIfNeeded(debtorSaveTransaction);

    return {
        payer: payerSaveTransaction,
        debtor: debtorSaveTransaction,
    };
};

const calculateTotalAmount = (saveSubtransactions?: ynab.SaveSubTransaction[] | null) => {
    let totalAmount = 0;

    if (saveSubtransactions != undefined) {
        saveSubtransactions.forEach((payerSaveSubtransaction) => {
            totalAmount = totalAmount + payerSaveSubtransaction.amount;
        });
    }

    return totalAmount;
};

export type { AmountEntry };
export { buildSaveTransactions };
