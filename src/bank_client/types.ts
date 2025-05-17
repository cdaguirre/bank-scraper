export interface CreditCardIdentifier {
    productType: string;
    productSubType: string;
    creditCardId: string;
    truncatedPan: string;
}

export interface Movement {
    transactionId: string;
    description: string;
    amount: number;
    transactionDate: Date;
    confirmed: boolean;
}