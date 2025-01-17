import { Setting } from "../interface/setting.interface";

export class GetSettingOption {
   static readonly type = "[Setting] Get";
}

export class GetBackendSettingOption {
   static readonly type = "[Setting] Backend Get";
}
 
export class UpdateSettingOption {
   static readonly type = "[Setting] Update";
   constructor(public payload: Setting){}
}