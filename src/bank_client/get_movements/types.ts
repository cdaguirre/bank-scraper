export interface TransactionRequest {
    transactionType: string;
    pagination: {
        limit: number;
    };
    creditCard: {
        productType: string;
        productSubType: string;
        creditCardId: string;
        truncatedPan: string;
    };
}

type Year = string;
type Month = string;
type Day = string;
type Hour = string;
type Minute = string;
type Second = string;

interface TransactionDetails {
    transactionId: string;
    description: string;
    transactionAmount: number;
    transactionDate: `${Year}-${Month}-${Day}T${Hour}:${Minute}:${Second}Z`;
    accountingDate: `${Year}-${Month}-${Day}`;
}

interface TransactionOwnership {
    ownershipId: 'A' | 'T' | string;
}

interface TransactionLocation {
    address: string;
    country?: string;
    commerce: {
        code: number;
    };
}

interface TransactionType {
    code: string;
    description: string;
}

interface InstallmentInfo {
    amount: number;
    pendingInstallmentNumber: number;
    totalInstallmentNumber: number;
    currentInstallmentNumber: number;
    installmentAmount: number;
    pendingInstallmentAmount: number;
    allowModification: boolean;
    isExtendable: boolean;
}

interface AccountingActionType {
    code: string;
    description: string;
}

interface DetailIdentifiers {
    extractNumber: string;
    extractMovementNumber: string;
    installmentOperationNumber: string;
    financingNumber: string;
    authorizationId: string;
    transactionId: string;
}

interface Transaction {
    transaction: TransactionDetails;
    ownership: TransactionOwnership;
    transactionLocation: TransactionLocation;
    transactionType: TransactionType;
    transactionStatus: Record<string, unknown>;
    transactionSubStatus: Record<string, unknown>;
    installmentInfo: InstallmentInfo;
    currency: {
        code: number;
        description: string;
    };
    accountingActionType: AccountingActionType;
    invoiceTypes: {
        code: string;
    };
    detailIdentifiers: DetailIdentifiers;
    movementType: 'A' | 'E' | string;
}

interface PaginationInfo {
    limit: number;
    page: number;
    prev: null;
    next: null;
}

interface TransactionsPayload {
    transactions: Transaction[];
    paginationInfo: PaginationInfo;
}

export interface TransactionsResponse {
    status: string;
    payload: TransactionsPayload;
}