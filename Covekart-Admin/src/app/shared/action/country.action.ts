import { Params } from "../interface/core.interface";
import { Country } from "../interface/country.interface";
export class GetCountries {
  static readonly type = "[Country] Get";
  constructor(public payload?: Params) {}
}