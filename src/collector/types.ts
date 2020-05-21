/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PaginationInput {
  limit: string;
  offset: string;
}

export interface PaginatedResponse {
  total: number;
  rows: any[];
}
