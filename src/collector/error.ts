import { Response } from 'node-fetch';

export class RetryableError extends Error {
  retryable = true;
}

export function retryableRequestError(response: Response): RetryableError {
  return new RetryableError(
    `Encountered retryable response from provider (status=${response.status})`,
  );
}

export function fatalRequestError(response: Response): Error {
  return new Error(
    `Encountered unexpected response from provider (status="${response.status}")`,
  );
}
