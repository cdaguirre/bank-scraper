import { BASE_HEADERS, makeSecureRequest } from '../../utils';
import { AccountDataResponse } from '../types';
import { BankClientRequestError } from '../../error';

export async function getAccountData(token: string): Promise<AccountDataResponse | unknown> {
  try {
    const response = await makeGetAccountDataRequest(token);
    return response;
  } catch (error) {
    throw new BankClientRequestError(`[GetAccountData Request]: Error getting account data. Error: ${error}`);
  }
}

export async function makeGetAccountDataRequest(token: string): Promise<AccountDataResponse | unknown> { 
  const response = await makeSecureRequest<AccountDataResponse | unknown>(
    'https://web2.bancofalabella.cl/bankingserver-api-falabella-web/rest/callService/json/massiveSelectCustomerOperation',
    {},
    {
      headers: {
        ...BASE_HEADERS,
        version: '2.0',
        channel: 'IN',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}
