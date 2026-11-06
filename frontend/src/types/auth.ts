
export interface LoginResponse{
    message: string;
    token: string;
    user_EMAIL: string;
}

export interface ErrorResponse{
    detail: string;
}