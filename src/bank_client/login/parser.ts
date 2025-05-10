import { BankClientParsingError } from '../error';
import type { LoginResponse } from './types';

export function parseLoginResponse(response: LoginResponse | unknown): string {
  if (typeof response === 'object' && response !== null && 'token' in response) {
    const loginResponse = response as LoginResponse;
    if (loginResponse.token && typeof loginResponse.token.access_token === 'string') {
      return loginResponse.token.access_token;
    }
  }
  throw new BankClientParsingError(`[Login parser]: Invalid login response. Response: ${JSON.stringify(response)}`);
}
