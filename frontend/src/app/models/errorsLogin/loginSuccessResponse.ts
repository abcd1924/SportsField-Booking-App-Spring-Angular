export interface LoginSuccessResponse {
    success: boolean;
    message: string;
    accessToken: string;
    tokenType: string;
    user?: any;
}