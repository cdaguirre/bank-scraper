import { BASE_HEADERS, makeSecureRequest } from '../utils';

import type { CreditCardIdentifier } from '../types';
import { BankClientRequestError } from '../error';

import type { TransactionRequest, TransactionsResponse } from './types';

export async function getCreditCardMovements(token: string, creditCard: CreditCardIdentifier) {
  try {
    const response = await makeGetCreditCardMovementsRequest(token, creditCard);
    return response;
  } catch (error) {
    throw new BankClientRequestError(`[GetCreditCardMovements Request]: Error getting credit card movements. Error: ${error}`);
  }
}

async function makeGetCreditCardMovementsRequest(token: string, creditCard: CreditCardIdentifier) {
  const body = buildBody(creditCard);
  const response = await makeSecureRequest<TransactionsResponse>(
    'https://web2.bancofalabella.cl/movement-cc/v2.0/credit-card/movements',
    body,
    {
      headers: {
        ...BASE_HEADERS,
        channel: 'IN',
        commerce: 'Banco',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}

function buildBody(creditCard: CreditCardIdentifier) {
  const movementsPayload: TransactionRequest = {
    transactionType: 'UNBILLED',
    pagination: { limit: 20 },
    creditCard,
  };

  return movementsPayload;
}
