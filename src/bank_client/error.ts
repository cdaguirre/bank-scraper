export class BankClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BankClientError';
  }
}

export class BankClientParsingError extends BankClientError {}

export class BankClientRequestError extends BankClientError {}

    