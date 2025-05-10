import { makeSecureRequest } from '../../utils';

import { BASE_HEADERS } from '../../utils';
import { CreditCardIdentifier, CreditCardsResponse } from '../types';
import { BankClientRequestError } from '../../error';
export async function getCreditCardData(
  token: string,
  creditCard: CreditCardIdentifier
): Promise<CreditCardsResponse> {
  try {
    const response = await makeCreditCardRequest(token, creditCard);
    return response;
  } catch (error) {
    throw new BankClientRequestError(`[GetCreditCardData Request]: Error getting credit card data. Error: ${error}`);
  }
}
async function makeCreditCardRequest(
  token: string,
  creditCard: CreditCardIdentifier
): Promise<CreditCardsResponse> {
  return makeSecureRequest<CreditCardsResponse>(
    'https://web2.bancofalabella.cl/movement-cc/v2.0/credit-card',
    { creditCard },
    {
      headers: {
        ...BASE_HEADERS,
        channel: 'IN',
        commerce: 'Banco',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}   