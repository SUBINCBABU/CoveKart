import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { SettingService } from "../services/setting.service";
import { GetSettingOption, GetBackendSettingOption, UpdateSettingOption } from "../action/setting.action";
import { Values } from "../interface/setting.interface";

export class SettingStateModel {
  setting: Values | null;
  backEndSetting: Values | null;
}

@State<SettingStateModel>({
  name: "setting",
  defaults: {
    setting: null,
    backEndSetting: null,
  }
})
@Injectable()
export class SettingState {

  constructor(private settingService: SettingService, 
    private notificationService: NotificationService) {}
  
  @Selector()
  static setting(state: SettingStateModel) {
    return state.setting;
  }
  
  @Selector()
  static backEndSetting(state: SettingStateModel) {
    return state.backEndSetting;
  }
  
  @Action(GetSettingOption)
  getSettingOptions(ctx: StateContext<SettingStateModel>) {
    return this.settingService.getSettingOption().pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            setting: result.values,
          });
        },
        error: (err) => {
          throw new Error(err?.error?.message);
        },
      })
    );
  }

  @Action(GetBackendSettingOption)
  getBackendSettingOption(ctx: StateContext<SettingStateModel>) {
    return this.settingService.getBackendSettingOption().pipe(
      tap({
        next: (result) => {
          
          ctx.patchState({
            backEndSetting: result.values,
          });
        },
        error: (err) => {
          throw new Error(err?.error?.message);
        },
      })
    );
  }



  @Action(UpdateSettingOption)
  UpdateSettingOption(ctx: StateContext<SettingStateModel>, action: UpdateSettingOption) {
    const values: Values = action.payload.values; 
    return this.settingService.updateSettingOption(values).pipe(
      tap({
        next: (response) => {
         
          ctx.patchState({
            backEndSetting: values, 
          });
          window.location.reload();
          this.notificationService.showSuccess("Settings updated successfully!");
        },
        error: (err) => {
          this.notificationService.showError("Failed to update settings.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }


 
  }
  
  