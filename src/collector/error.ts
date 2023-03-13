import { Response } from 'node-fetch';

export class RetryableError extends Error {
  retryable = true;
}

export function retryableRequestError(response: Response): RetryableError {
  return new RetryableError(
    `Encountered retryable response from provider (status=${response.status})`,
  );
}
