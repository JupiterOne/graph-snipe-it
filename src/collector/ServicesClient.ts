import nodeFetch, { Request } from 'node-fetch';
import { URLSearchParams } from 'url';

import { retry, sleep } from '@lifeomic/attempt';

import { retryableRequestError } from './error';
import {
  PaginatedResponse,
  SnipeItUser,
  ResourceIteratee,
  HardwareLicense,
  SnipeItConsumable,
  ConsumableUser,
  Location,
  SnipeItHardware,
} from './types';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../instanceConfigFields';

/**
 * Services Api
 * https://snipe-it.readme.io/reference
 */
export class ServicesClient {
  readonly hostname: string;
  readonly apiToken: string;

  readonly logger: IntegrationLogger;

  constructor(config: IntegrationConfig, logger: IntegrationLogger) {
    this.hostname = config.hostname.toLowerCase().replace(/^https?:\/\//, '');
    this.apiToken = config.apiToken;

    this.logger = logger;
  }

  test(): Promise<object[]> {
    return this.fetch('hardware', { limit: '1' });
  }

  async fetchUser(username: string): Promise<SnipeItUser | undefined> {
    const usersResponse = await this.fetch<PaginatedResponse<SnipeItUser>>(
      'users',
      {
        search: username,
      },
    );
    if (usersResponse.total > 0) return usersResponse.rows[0];
  }

  async iterateHardware(iteratee: ResourceIteratee<SnipeItHardware>) {
    await this.iterateAll<SnipeItHardware>('hardware', iteratee);
  }

  listLocations() {
    return this.listAll<Location>('locations');
  }

  listConsumables() {
    return this.listAll<SnipeItConsumable>('consumables');
  }

  async iterateConsumables(iteratee: ResourceIteratee<SnipeItConsumable>) {
    await this.iterateAll<SnipeItConsumable>('consumables', iteratee);
  }

  async iterateHardwareLicenses(
    id: number,
    iteratee: ResourceIteratee<HardwareLicense>,
  ) {
    await this.iterateAll<HardwareLicense>(`hardware/${id}/licenses`, iteratee);
  }

  async iterateUsers(iteratee: ResourceIteratee<SnipeItUser>) {
    await this.iterateAll<SnipeItUser>('users', iteratee);
  }

  async iterateConsumableUsers(
    id: string,
    iteratee: ResourceIteratee<ConsumableUser>,
  ) {
    await this.iterateAll<ConsumableUser>(
      `consumables/view/${id}/users`,
      iteratee,
    );
  }

  async listAll<T = unknown>(url: string): Promise<T[]> {
    const data: T[] = [];
    const limit = 500;
    let offset = 0;
    let total = 0;
    do {
      const response = await this.fetch<PaginatedResponse<T>>(url, {
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
    return data;
  }

  async iterateAll<T = unknown>(url: string, iteratee: ResourceIteratee<T>) {
    const limit = 500;
    let offset = 0;
    let total = 0;
    do {
      const response = await this.fetch<PaginatedResponse<T>>(url, {
        offset: offset.toString(),
        limit: limit.toString(),
      });
      if (!response.rows) {
        break;
      }
      total = response.total;
      offset += limit;
      for (const row of response.rows) {
        await iteratee(row);
      }
    } while (offset < total);
  }

  fetch<T = object>(
    url: string,
    queryParams: { [param: string]: string | string[] } = {},
    request?: Omit<Request, 'url'>,
  ): Promise<T> {
    return retry(
      async () => {
        const qs = new URLSearchParams(queryParams).toString();
        const requestUrl = `https://${this.hostname}/api/v1/${url}${
          qs ? '?' + qs : ''
        }`;

        const response = await nodeFetch(requestUrl, {
          ...request,
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            ...request?.headers,
          },
        });

        /**
         * We are working with a json api, so just return the parsed data.
         */
        if (response.ok) {
          return response.json() as T;
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(response, requestUrl);
        } else {
          throw new IntegrationProviderAPIError({
            code: 'SnipeItClientApiError',
            status: response.status,
            endpoint: response.url,
            statusText: response.statusText,
          });
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
          if (err.status === 429) {
            const retryAfter = err.retryAfter ? err.retryAfter * 1000 : 5000;
            this.logger.info(
              { retryAfter },
              `Received a rate limit error.  Waiting before retrying.`,
            );
            sleep(retryAfter)
              .then(() => {
                this.logger.info(`Slept for ${retryAfter}ms. Retrying...`);
              })
              .catch((err) => {
                // this should never happen, but just in case
                this.logger.error(
                  err,
                  `Error while waiting to retry after rate limit error.`,
                );
              });
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
