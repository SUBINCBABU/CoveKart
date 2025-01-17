import { Params } from "../interface/core.interface";
import { CheckoutPayload, RePaymentPayload } from "../interface/order.interface";

export class GetOrders {
  static readonly type = "[Order] Get";
  constructor(public payload?: Params) {}
}

export class ViewOrder {
  static readonly type = "[Order] View";
  constructor(public id: number) {}
}

export class Checkout {
  static readonly type = "[Order] Checkout";
  constructor(public payload: CheckoutPayload) {}
}

export class PlaceOrder {
  static readonly type = "[Order] Place";
  constructor(public payload: CheckoutPayload) {}
}

export class Clear {
  static readonly type = "[Order] Clear";
  constructor() {}
}

export class RePayment {
  static readonly type = "[Order] Repayment";
  constructor(public payload: RePaymentPayload) {}
}

export class VerifyPayment {
  static readonly type = "[Order] Verify";
  constructor(public id: number) {}
}
