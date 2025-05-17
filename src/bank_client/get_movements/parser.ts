import { parse } from 'date-fns';

import { TransactionsResponse } from './types';
import { Movement } from '../types';

import { BankClientParsingError } from '../error';

export function parseResponse(response: TransactionsResponse): Movement[] {
  try {
    return getCreditCardMovements(response);
  } catch (error) {
    if (error instanceof BankClientParsingError) {
      throw error;
    }
    throw new BankClientParsingError(
      `[Parsing error]: Error parsing account data response: ${error}. Response: ${JSON.stringify(response)}`
    );
  }
}

function getCreditCardMovements(response: TransactionsResponse) {
  const transactions = response.payload.transactions;
  const movements = transactions.map((transaction) => {
    return {
      transactionId: transaction.transaction.transactionId,
      description: transaction.transaction.description,
      amount: transaction.transaction.transactionAmount,
      transactionDate: parseDate(transaction.transaction.transactionDate),
      confirmed: transaction.movementType === 'E',
      owner: transaction.ownership.ownershipId,
    };
  });
  return movements;
}


function parseDate(date: string) {
  return parse(date, 'yyyy-MM-dd', new Date());
}


