import { loginRequest } from './request';
import { parseLoginResponse } from './parser';
import type { LoginResponse } from './types';

export async function login(username: string, password: string): Promise<LoginResponse | unknown> {
  const loginResponse = await loginRequest(username, password);
  const token = parseLoginResponse(loginResponse);
  return token;
}
