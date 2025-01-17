import { Params } from "../interface/core.interface";

export class GetCategories {
    static readonly type = "[Category] Get";
    constructor(public payload?: Params) {}
}
