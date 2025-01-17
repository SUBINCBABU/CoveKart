
export interface MenuModel {
  data: Menu[];
}

export interface Menu {
  id?: number;
  parent_id?: number;
  title?: string;
  path?: string;
  active?: boolean;
  children?: Menu[];
  icon?: string;
  type?:String;
  badgeType?: string;
	badgeValue?: string | number;
  level?: number;
  acl_permission?: string[];
  permission?: string[];
}

export interface Badges {
  product: Product;
  store: Store;
  refund: Refund;
  withdraw_request: WithdrawRequest;
}

export interface Product {
  total_products: number;
  total_approved_products: number;
  total_in_approved_products: number;
}

export interface Store {
  total_stores: number;
  total_approved_stores: number;
  total_in_approved_stores: number;
}

export interface Refund {
  total_refunds: number;
  total_pending_refunds: number,
  total_approved_refunds: number;
  total_rejected_refunds: number;
}

export interface WithdrawRequest {
  total_withdraw_requests: number;
  total_pending_withdraw_requests: number,
  total_approved_withdraw_requests: number;
  total_rejected_withdraw_requests: number;
}

