import { Params } from "../interface/core.interface";

export class GetProducts {
  static readonly type = "[Product] Get";
  constructor(public payload?: Params) {}
}

export class GetRelatedProducts {
  static readonly type = "[Product] Related Get";
  constructor(public payload?: Params) {}
}

export class GetStoreProducts {
  static readonly type = "[Product] Store Get";
  constructor(public payload?: Params) {}
}

export class GetProductBySlug {
  static readonly type = "[Product] Get By Slug";
  constructor(public slug: string) {}
}

export class GetDealProducts {
  static readonly type = "[Product] Deal Get";
  constructor(public payload?: Params) {}
}
