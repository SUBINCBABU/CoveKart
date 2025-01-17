import { Params } from "../interface/core.interface";

export class GetMenu {
  static readonly type = '[Menu] Get';
}

export class GetBadges {
  static readonly type = "[Menu] Badges Get";
  constructor(public payload?: Params) {}
}

export class UpdateBadgeValue {
  static readonly type = '[Menu] Update Badge';
  constructor(public path: string, public badgeValue: number) {}
}