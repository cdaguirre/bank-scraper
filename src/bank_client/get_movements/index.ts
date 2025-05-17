import { CreditCardIdentifier } from '../types';
import { parseResponse } from './parser';
import { getCreditCardMovements } from './request';

export async function getMovements(token: string, creditCard: CreditCardIdentifier) {
  const movementResponse = await getCreditCardMovements(token, creditCard);    
  const movements = parseResponse(movementResponse);
  return movements;
}