import { AccountDataResponse, CreditCardData } from '../types';
import { BankClientParsingError } from '../../error';

export function parseResponse(response: AccountDataResponse | unknown): CreditCardData {
  try {
    return getAccountData(response);
  } catch (error) {
    if (error instanceof BankClientParsingError) {
      throw error;
    }
    throw new BankClientParsingError(
      `[Parsing error]: Error parsing account data response: ${error}. Response: ${JSON.stringify(response)}`
    );
  }
}

function getAccountData(response: AccountDataResponse | unknown): CreditCardData {
  if (!validateResponse(response)) {
    throw new BankClientParsingError(`[Parsing error]: Invalid account data response. Credit card identifier not found. Response: ${JSON.stringify(response)}`);
  }

  const creditCardIdentifier = getCreditCardIdentifier(response);

  if (!validateCreditCardIdentifier(creditCardIdentifier)) {
    throw new BankClientParsingError(
      `[Parsing error]: Invalid account data response. Credit card identifier not found. Response: ${JSON.stringify(response)}`
    );
  }

  const [productType, productSubType, creditCardId, truncatedPan] = creditCardIdentifier.split('#');

  return {
    creditCardIdentifier: {
      productType,
      productSubType,
      creditCardId,
      truncatedPan,
    },
    purchaseLimit: getPurchaseLimit(response),
    purchaseAcum: getPurchaseAcum(response),
  };
}

function validateResponse(response: AccountDataResponse | unknown): boolean {
  if (typeof response !== 'object' || response === null || !('creditCards' in response)) {
    return false;
  }

  return true;
}

function getCreditCardIdentifier(response: AccountDataResponse | unknown): string {
  const creditCards = (response as AccountDataResponse).creditCards;
  return creditCards.creditCard.customerOperationPermission.customerOperation.operationInternalNumber;
}

function validateCreditCardIdentifier(creditCardIdentifier: string): boolean {
  const [productType, productSubType, creditCardId, truncatedPan] = creditCardIdentifier.split('#');
  return !!(productType && productSubType && creditCardId && truncatedPan);
}

function getPurchaseLimit(response: AccountDataResponse | unknown): number {
  const creditCards = (response as AccountDataResponse).creditCards;
  return creditCards.creditCard.purchaseLimit;
}

function getPurchaseAcum(response: AccountDataResponse | unknown): number {
  const creditCards = (response as AccountDataResponse).creditCards;
  return creditCards.creditCard.purchaseAcum;
}