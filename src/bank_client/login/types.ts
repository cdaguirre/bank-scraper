export interface LoginRequest {
    identificationType: string;
    identificationNumber: string;
    password: string;
}

export interface LoginResponse {
    token: {
        access_token: string;
        token_type: string;
        expires_in: number;
        scope: string;
        jti: string;
    };
}