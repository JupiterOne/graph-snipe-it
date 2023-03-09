import { Response } from 'node-fetch';

export class RetryableError extends Error {
  retryable = true;
}

export class FatalRequestError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function retryableRequestError(response: Response): RetryableError {
  return new RetryableError(
    `Encountered retryable response from provider (status=${response.status})`,
  );
}

export function fatalRequestError(response: Response): Error {
  return new FatalRequestError(
    `Encountered unexpected response from provider (status="${response.status}")`,
    response.status,
  );
}
