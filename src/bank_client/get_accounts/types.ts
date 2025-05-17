import { CreditCardIdentifier } from '../types';

interface CustomerOperation {
    operationInternalNumber: string;
}

interface CreditCard {
    customerOperationPermission: {
        customerOperation: CustomerOperation;
    },
    purchaseAcum: number;
    purchaseLimit: number;
}

export interface AccountDataResponse {
    accounts: null | unknown;
    viewAccounts: null | unknown;
    savingAccounts: null | unknown;
    agreements: null | unknown;
    creditCards: {
        creditCard: CreditCard;
    };
}

export interface CreditCardData {
    creditCardIdentifier: CreditCardIdentifier;
    purchaseLimit: number;
    purchaseAcum: number;
}

interface Product {
    id: string;
    productType: string;
    productSubtype: string;
    activationDate: string;
}

interface LastBillingSummary {
    paymentDate: string;
    lastBillingDate: string;
    expirationDate: string;
    billedAmount: number;
    amountPaid: number;
    minimumPayment: number;
    foreignAmountBilled: number;
    accumulatedPoints: number;
}

interface NextBillingSummary {
    amountForBilling: number;
    foreignAmountForBilling: number;
    nextBillingDate: string;
    nextExpirationDate: string;
}

interface BillingSummary {
    startingBillingDate: string;
    endingBillingDate: string;
    pendingPaymentAmount: number;
    lastBillingSummary: LastBillingSummary;
    nextBillingSummary: NextBillingSummary;
}

interface Card {
    PAN: string;
    cardRefId: string;
    accountNickname: string;
    expirationDate: string;
    type: string;
    trademark: string;
    stampingCode: string;
}

interface CreditCardsPayload {
    product: Product;
    currency: { code: string };
    billingSummary: BillingSummary;
    card: Card;
}

export interface CreditCardsResponse {
    status: string;
    payload: CreditCardsPayload;
}
