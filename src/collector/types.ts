/* eslint-disable @typescript-eslint/no-explicit-any */
import { Opaque } from 'type-fest';
export interface PaginationInput {
  limit: string;
  offset: string;
}

export interface PaginatedResponse<T> {
  total: number;
  rows: T[];
}

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export type HardwareAsset = Opaque<any, 'HardwareAsset'>;

export type ConsumableUser = {
  name: string;
};

export interface Location {
  id: number;
  name: string;
  image?: string;
  address?: string;
  address2?: string;
  city: string;
  state?: string;
  country: string;
  zip?: string;
  assigned_assets_count: number;
  assets_count: number;
  rtd_assets_count: number;
  users_count: number;
  currency?: string;
  created_at: DateObject;
  updated_at: DateObject;
  available_actions: {
    update: boolean;
    delete: boolean;
    clone: boolean;
  };
}

export interface HardwareLicense {
  id: number;
  name: string;
  company?: RecordSummary;
  manufacturer?: RecordSummary;
  product_key: string;
  order_number: string;
  purchase_order: string;
  purchase_date?: DateObject;
  termination_date?: DateObject;
  depreciation?: RecordSummary;
  purchase_cost?: string;
  purchase_cost_numeric?: string;
  notes: string;
  expiration_date?: DateObject;
  seats: number;
  free_seats_count: number;
  license_name: string;
  license_email: string;
  reassignable: boolean;
  maintained: boolean;
  supplier?: RecordSummary;
  category: RecordSummary;
  created_at: DateObject;
  updated_at: DateObject;
  deleted_at?: DateObject;
  user_can_checkout: boolean;
  available_actions: {
    checkout: boolean;
    checkin: boolean;
    clone: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface SnipeItUser {
  id: number;
  avatar: string;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
  remote: boolean;
  locale?: string;
  employee_num?: string;
  manager?: RecordSummary;
  jobtitle?: string;
  vip: boolean;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  email?: string;
  department?: RecordSummary;
  location?: RecordSummary;
  notes: string;
  permissions?: Permissions;
  activated: boolean;
  ldap_import: boolean;
  two_factor_activated?: boolean;
  two_factor_enrolled: boolean;
  two_factor_optin: boolean;
  assets_count: number;
  licenses_count: number;
  accessories_count: number;
  consumables_count: number;
  company?: RecordSummary;
  created_by: RecordSummary;
  created_at: DateObject;
  updated_at: DateObject;
  start_date?: DateObject;
  end_date?: DateObject;
  last_login?: DateObject;
  deleted_at?: DateObject;
  available_actions: {
    update: boolean;
    delete: boolean;
    clone: boolean;
    restore: boolean;
  };
  groups?: {
    total: number;
    rows: RecordSummary[];
  };
}

export interface SnipeItConsumable {
  id: number;
  name: string;
  image?: string;
  category: RecordSummary;
  company?: any;
  item_no: string;
  location?: RecordSummary;
  manufacturer?: RecordSummary;
  min_amt: number;
  model_number?: string;
  remaining: number;
  order_number: string;
  purchase_cost?: string;
  purchase_date?: DateObject;
  qty: number;
  notes?: string;
  created_at: DateObject;
  updated_at: DateObject;
  user_can_checkout: boolean;
  available_actions: {
    checkout: boolean;
    checkin: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface Permissions {
  superuser: string | number;
  admin: string;
  import: string;
  'reports.view': string;
  'assets.view': string;
  'assets.create': string;
  'assets.edit': string;
  'assets.delete': string;
  'assets.checkin': string;
  'assets.checkout': string;
  'assets.audit': string;
  'assets.view.requestable': string;
  'accessories.view': string;
  'accessories.create': string;
  'accessories.edit': string;
  'accessories.delete': string;
  'accessories.checkout': string;
  'accessories.checkin': string;
  'accessories.files': string;
  'consumables.view': string;
  'consumables.create': string;
  'consumables.edit': string;
  'consumables.delete': string;
  'consumables.checkout': string;
  'consumables.files': string;
  'licenses.view': string;
  'licenses.create': string;
  'licenses.edit': string;
  'licenses.delete': string;
  'licenses.checkout': string;
  'licenses.keys': string;
  'licenses.files': string;
  'components.view': string;
  'components.create': string;
  'components.edit': string;
  'components.delete': string;
  'components.checkout': string;
  'components.checkin': string;
  'components.files': string;
  'kits.view': string;
  'kits.create': string;
  'kits.edit': string;
  'kits.delete': string;
  'users.view': string;
  'users.create': string;
  'users.edit': string;
  'users.delete': string;
  'models.view': string;
  'models.create': string;
  'models.edit': string;
  'models.delete': string;
  'categories.view': string;
  'categories.create': string;
  'categories.edit': string;
  'categories.delete': string;
  'departments.view': string;
  'departments.create': string;
  'departments.edit': string;
  'departments.delete': string;
  'statuslabels.view': string;
  'statuslabels.create': string;
  'statuslabels.edit': string;
  'statuslabels.delete': string;
  'customfields.view': string;
  'customfields.create': string;
  'customfields.edit': string;
  'customfields.delete': string;
  'suppliers.view': string;
  'suppliers.create': string;
  'suppliers.edit': string;
  'suppliers.delete': string;
  'manufacturers.view': string;
  'manufacturers.create': string;
  'manufacturers.edit': string;
  'manufacturers.delete': string;
  'depreciations.view': string;
  'depreciations.create': string;
  'depreciations.edit': string;
  'depreciations.delete': string;
  'locations.view': string;
  'locations.create': string;
  'locations.edit': string;
  'locations.delete': string;
  'companies.view': string;
  'companies.create': string;
  'companies.edit': string;
  'companies.delete': string;
  'self.two_factor': string;
  'self.api': string;
  'self.edit_location': string;
  'self.checkout_assets': string;
  'self.view_purchase_cost': string;
}

interface RecordSummary {
  id: number;
  name: string;
}

interface DateObject {
  datetime: string;
  formatted: string;
}
