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

export type HardwareAsset = Opaque<
  {
    id: number;
    name: string;
    asset_tag: string;
    serial: string;
    model: {
      id: number;
      name: string;
    };
    model_number: string;
    eol: {
      date: string;
      formatted: string;
    };
    status_label: {
      id: number;
      name: string;
      status_type: string;
      status_meta: string;
    };
    category: {
      id: number;
      name: string;
    };
    manufacturer?: {
      id: number;
      name: string;
    };
    supplier: {
      id: number;
      name: string;
    };
    notes: string;
    order_number: string;
    company?: string;
    location: {
      id: number;
      name: string;
    };
    rtd_location: {
      id: number;
      name: string;
    };
    image: string;
    qr: string;
    created_at: {
      datetime: string;
      formatted: string;
    };
    updated_at: {
      datetime: string;
      formatted: string;
    };
    purchase_date: {
      date: string;
      formatted: string;
    };
    purchase_cost: string;
    checkin_counter: number;
    checkout_counter: number;
    requests_counter: number;
    user_can_checkout: boolean;
    available_actions: {
      checkout: boolean;
      checkin: boolean;
      clone: boolean;
      restore: boolean;
      update: boolean;
      delete: boolean;
    };
    assigned_to?: {
      id: number;
      username?: string;
      name: string;
      first_name?: string;
      last_name?: string;
      employee_number?: string;
      type: string;
    };
  },
  'HardwareAsset'
>;

export type SnipeItUser = Opaque<any, 'SnipeItUser'>;
export type SnipeItConsumable = Opaque<any, 'SnipeItConsumable'>;
export type SnipeItLicense = Opaque<any, 'SnipeItLicense'>;
export type ConsumableUser = Opaque<any, 'ConsumableUser'>;
