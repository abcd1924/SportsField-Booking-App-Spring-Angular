import { FieldError } from "./fieldError";

export interface ErrorResponse {
    success: boolean;
    message: string;
    fieldErrors: FieldError[];
    status: number;
    timestamp: number;
}