/* eslint-disable @typescript-eslint/no-explicit-any */
import { Opaque } from 'type-fest';
export interface PaginationInput {
  limit: string;
  offset: string;
}

export interface PaginatedResponse {
  total: number;
  rows: any[];
}

export type HardwareAsset = Opaque<any, 'HardwareAsset'>;
export type SnipeItUser = Opaque<any, 'SnipeItUser'>;
export type SnipeItConsumable = Opaque<any, 'SnipeItConsumable'>;
export type SnipeItLicense = Opaque<any, 'SnipeItLicense'>;
export type ConsumableUser = Opaque<any, 'ConsumableUser'>;
