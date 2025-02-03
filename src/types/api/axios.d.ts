/* eslint-disable @typescript-eslint/no-unused-vars */
import { InternalAxiosRequestConfig } from 'axios';
/* eslint-enable @typescript-eslint/no-unused-vars */

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    retryCount?: number;
  }
}
