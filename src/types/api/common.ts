export type APIResponse<T> = {
  message: string | null;
  result: T;
};

export type APIErrorCode = 
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN'; 