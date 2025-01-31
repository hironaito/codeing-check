import { API_ERROR_MESSAGES } from '@/services/api/constants';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export type APIErrorType = typeof API_ERROR_MESSAGES[keyof typeof API_ERROR_MESSAGES];

export interface ErrorResponse {
  message: string;
  statusCode: number;
} 