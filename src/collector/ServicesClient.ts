import nodeFetch, { Request } from 'node-fetch';
import { URLSearchParams } from 'url';

import { retry } from '@lifeomic/attempt';

import { IntegrationConfig } from '../types';
import { fatalRequestError, retryableRequestError } from './error';
import { HardwareAsset, PaginatedResponse, SnipeItUser } from './types';

/**
 * Services Api
 * https://snipe-it.readme.io/reference
 */
export class ServicesClient {
  readonly hostname: string;
  readonly apiToken: string;

  constructor(config: IntegrationConfig) {
    this.hostname = config.hostname.toLowerCase().replace(/^https?:\/\//, '');
    this.apiToken = config.apiToken;
  }

  test(): Promise<object[]> {
    return this.fetch('hardware', { limit: '1' });
  }

  async fetchUser(username: string): Promise<SnipeItUser | undefined> {
    const usersResponse = await this.fetch<PaginatedResponse>('users', {
      search: username,
    });
    if (usersResponse.total > 0) return usersResponse.rows[0];
  }

  async iterateHardware(
    iteratee: (asset: HardwareAsset) => Promise<void>,
  ): Promise<void> {
    const limit = 500;
    let offset = 0;
    let total = 0;

    do {
      const response: PaginatedResponse = await this.fetch('hardware', {
        offset: offset.toString(),
      });
      if (!response.rows) {
        break;
      }
      total = response.total;
      offset += limit;
      for (const resource of response.rows) {
        await iteratee(resource);
      }
    } while (offset < total);
  }

  listLocations(): Promise<object[]> {
    return this.iterateAll('locations');
  }

  listConsumables(): Promise<object[]> {
    return this.iterateAll('consumables');
  }

  listHardwareLicenses(id: number): Promise<object[]> {
    return this.iterateAll(`hardware/${id}/licenses`);
  }

  listUsers(): Promise<object[]> {
    return this.iterateAll('users');
  }

  listConsumableUsers(consumableId: string): Promise<object[]> {
    return this.iterateAll(`consumables/view/${consumableId}/users`);
  }

  async iterateAll<T = object[]>(url: string): Promise<T> {
    const data: any[] = [];
    const limit = 500;
    let offset = 0;
    let total = 0;
    do {
      const response: PaginatedResponse = await this.fetch(url, {
        offset: offset.toString(),
        limit: limit.toString(),
      });
      if (!response.rows) {
        break;
      }
      total = response.total;
      offset += limit;
      data.push(...response.rows);
    } while (offset < total);
    return (data as unknown) as T;
  }

  fetch<T = object>(
    url: string,
    queryParams: { [param: string]: string | string[] } = {},
    request?: Omit<Request, 'url'>,
  ): Promise<T> {
    return retry(
      async () => {
        const qs = new URLSearchParams(queryParams).toString();
        const response = await nodeFetch(
          `https://${this.hostname}/api/v1/${url}${qs ? '?' + qs : ''}`,
          {
            ...request,
            headers: {
              Authorization: `Bearer ${this.apiToken}`,
              ...request?.headers,
            },
          },
        );

        /**
         * We are working with a json api, so just return the parsed data.
         */
        if (response.ok) {
          return response.json() as T;
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(response);
        } else {
          throw fatalRequestError(response);
        }
      },
      {
        maxAttempts: 10,
        delay: 200,
        factor: 2,
        jitter: true,
        handleError: (err, context) => {
          if (!err.retryable) {
            // can't retry this? just abort
            context.abort();
          }
        },
      },
    );
  }
}

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}
