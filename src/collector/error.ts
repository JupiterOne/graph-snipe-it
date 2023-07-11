import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { Response } from 'node-fetch';

export interface RateLimitErrorParams {
  cause?: Error;
  endpoint: string;
  status: string | number;
  statusText: string;
  retryAfter: number;
}
export class RateLimitError extends IntegrationProviderAPIError {
  constructor(options: RateLimitErrorParams) {
    super(options);
    this.retryAfter = options.retryAfter;
  }
  retryAfter: number;
  retryable = true;
}

export function retryableRequestError(
  response: Response,
  requestUrl: string,
): any {
  if (response.status === 401) {
    return new IntegrationProviderAuthenticationError({
      status: response.status,
      statusText: response.statusText,
      endpoint: requestUrl,
    });
  }
  if (response.status === 403) {
    return new IntegrationProviderAuthorizationError({
      status: response.status,
      statusText: response.statusText,
      endpoint: requestUrl,
    });
  }
  if (response.status === 429) {
    return new RateLimitError({
      status: response.status,
      statusText: response.statusText,
      endpoint: requestUrl,
      retryAfter: Number(response.headers.get('retry-after')),
    });
  }

  return new IntegrationProviderAPIError({
    status: response.status,
    statusText: response.statusText,
    endpoint: requestUrl,
  });
}
