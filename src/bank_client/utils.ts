import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import axios, { AxiosRequestConfig } from 'axios';

export const BANKING_SERVER_PUB_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmHFzeOYB6bWCSif6NFInVkubz+XuoarKkNw6rUkCWGDydsekxMTyr2NfC2sCY41eIOQ/oeQMachL+Rl9QOCSez/wdd4kdP8HJfIEdJUgJkZBH1e2/ADPmtAs4WOgEFEczZJSgvh/S7DLvcgD02R19JuH4Fr9LuEXcZPe1hdFzQCRKPaZbVaclWlRDlTonaMkRjJ4M6Ljqr6o5RN/mdaJcUiSr0OEMN001ty2p9/Q8HQmMY2T6r+C/9KCU8lhTbyjNlyKMlsd3OMOC8FDyLekBL0dH42iA50lTI/0aIW1jsRJeIQaoV9ffuWtEbZX/h1hitPMFyeK62bJo1jgTVKoWOPUFCQJfHw7XcqgY+SYxqMpfLp2rHAxjkJNdnxXY6rXaQosllgXx8dbDaO1YDd9oWb+q1HlbnyqBFQCO+aTLckk0vvlNS+aOIHHB7ElUvT1eQ3bjJqdRAEd/C6ZQFkQ5ceHgf/0/VPthNZp6cJ1Ily4aUTwpaYz45f0xl+HP3H95B1bx1/H9VWT0IsBIjGEUA3g2JId8kIPL6676iJG16zCH+bLIQ0xJFNlbGNorCgiUkOHAiTG/v+HFkQSIuquLzWw7KXKAd2A3ScoMjtc5+T3TBxDpcO97CWfiVRAS5drftHxG/PrbFNzRh4Yb2asld9QxGOqRoLoMG/exJ1lY8sCAwEAAQ==
-----END PUBLIC KEY-----`.trim();

export const BASE_HEADERS = {
  'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0',
  Accept: 'application/json',
  'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  Referer: 'https://web2.bancofalabella.cl/',
  'Content-Type': 'application/json',
  Origin: 'https://web2.bancofalabella.cl',
  Connection: 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  TE: 'trailers',
};

export function encryptMessage(message: string, key: string): string {
  const publicKey = crypto.createPublicKey({
    key: key,
    format: 'pem',
    type: 'pkcs1',
  });

  const buffer = Buffer.from(message, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );

  return encrypted.toString('base64');
}

export function getRandomPassword(): string {
  return CryptoJS.lib.WordArray.random(10).toString();
}

export interface SecureRequest {
    m: string;
    p: string;
    s: string;
    i: string;
}

export async function createSecureRequest(
  data: string,
  password: string,
  publicKey: string
): Promise<SecureRequest> {
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 8,
    iterations: 100,
    hasher: CryptoJS.algo.SHA1,
  });

  const encryptedData = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  const encryptedPassword = encryptMessage(password, publicKey);

  return {
    m: encryptedData.toString(),
    p: encryptedPassword,
    s: salt.toString(),
    i: iv.toString(),
  };
}

export function resolveSecureResponse(response: SecureRequest, password: string): string {
  const encryptedData = response.m;
  const salt = CryptoJS.enc.Hex.parse(response.s);
  const iv = CryptoJS.enc.Hex.parse(response.i);

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 8,
    iterations: 100,
    hasher: CryptoJS.algo.SHA1,
  });

  return CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8);
}

export async function makeSecureRequest<T>(
  url: string,
  data: unknown,
  config: AxiosRequestConfig
): Promise<T> {
  const randomPassword = getRandomPassword();
  const secureRequest = await createSecureRequest(
    JSON.stringify(data),
    randomPassword,
    BANKING_SERVER_PUB_KEY
  );

  const response = await axios.post(url, secureRequest, config);
  const responseData = resolveSecureResponse(response.data, randomPassword);
  return JSON.parse(responseData);
}
