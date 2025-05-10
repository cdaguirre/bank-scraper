import { BASE_HEADERS, encryptMessage, makeSecureRequest } from '../utils';
import type { LoginRequest, LoginResponse } from './types';

const NARYA_PUB_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsRQZy2RPglChodLB3SnrBmi+XnJ6kxBH5nH3BBcLI78eLpmw0TKTRSQpSSIqYS8+68U2lv8i0XSL9+CVAYCOL7gOvwh/+go0jvu/QgGK2j5eP8FKjZSAOhHzClFmHgZJ0b2ENveD6FQG+9/LydGsG9DBeocYdwtdMwtuh/gY++kaRMuINWcgy0yCPcb6dJVNl18CC4sdy0fpybkNjXJD5K+rDhUaWMV2q3VU9oNuJlZ5b5+2CxGQbmAmLdxfFE8bCxEBmj6g2DSkNlVU1Hjrf0sC/zRBEz49hFMAuR/mDMlxECfCXBzBFa/zNr9LYgAjns6HLnDvqymPRS6tobPfTwIDAQAB
-----END PUBLIC KEY-----`.trim();

async function makeLoginRequest(username: string, password: string): Promise<LoginResponse> {
  const encryptedPassword = encryptMessage(password, NARYA_PUB_KEY);

  const loginData: LoginRequest = {
    identificationType: 'RUT',
    identificationNumber: username,
    password: encryptedPassword,
  };

  const response = await makeSecureRequest<LoginResponse>(
    'https://web2.bancofalabella.cl/one-web/login',
    loginData,
    {
      headers: {
        ...BASE_HEADERS,
        channel: 'IN',
        'Sec-Fetch-Site': 'same-site',
      },
      decompress: true,
    }
  );

  return response;
}

export async function loginRequest(username: string, password: string): Promise<LoginResponse | unknown> {
  try {
    const response = await makeLoginRequest(username, password);
    return response;
  } catch (error) {
    throw new Error(`[Request error]: Error while requesting login. ${error}`);
  }
}
