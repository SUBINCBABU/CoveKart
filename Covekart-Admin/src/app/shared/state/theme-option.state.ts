import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { ThemeOptionService } from "../services/theme-option.service";
import { GetThemeOption, UpdateThemeOption } from "../action/theme-option.action";
import { NotificationService } from "../services/notification.service";
import { Option, ThemeOption } from "../interface/theme-option.interface";

export class ThemeOptionStateModel {
  theme_option: Option | null;
}

@State<ThemeOptionStateModel>({
  name: "theme_option",
  defaults: {
    theme_option: null,
  },
})
@Injectable()
export class ThemeOptionState {

  constructor(private themeOptionService: ThemeOptionService, 
    public notificationService: NotificationService) {}

  @Selector()
  static themeOptions(state: ThemeOptionStateModel) {
    return state.theme_option;
  }

  @Action(GetThemeOption)
  getThemeOptions(ctx: StateContext<ThemeOptionStateModel>) {
    return this.themeOptionService.getThemeOption().pipe(
      tap({
        next: (result: ThemeOption) => {
        
          ctx.patchState({
            theme_option: result.options,
          });
        },
        error: (err) => {
          throw new Error(err?.error?.message);
        },
      })
    );
  }

  // @Action(UpdateThemeOption)
  // UpdateThemeOption( ctx: StateContext<ThemeOptionStateModel>, action: UpdateThemeOption) {
  //   // Update Theme OPtion Logic Here
  // }


  @Action(UpdateThemeOption)
updateThemeOption(
  ctx: StateContext<ThemeOptionStateModel>, 
  action: UpdateThemeOption
) {
  return this.themeOptionService.updateThemeOption({ id: 1, options: action.payload.options }).pipe(
    tap({
      next: (result: ThemeOption) => {
        ctx.patchState({
          theme_option: result.options,
        });
        window.location.reload();
        this.notificationService.success('Theme updated successfully!');
      },
      error: (err) => {
        this.notificationService.error('Failed to update theme options.');
        throw new Error(err?.error?.message);
      },
    })
  );
}



  

}
