import { parseResponse } from './parser/get_account';
import { getAccountData } from './request/get_account';
import { getCreditCardData } from './request/get_credit_card';
import { CreditCardData } from './types';

export async function getCreditCard(token: string): Promise<CreditCardData> {
  const accountData = await getAccountData(token);
  const creditCard = parseResponse(accountData);
  await getCreditCardData(token, creditCard.creditCardIdentifier); // Request needed to continue the process
  return creditCard;
}