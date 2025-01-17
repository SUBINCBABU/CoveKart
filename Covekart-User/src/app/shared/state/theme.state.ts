import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { ThemeService } from "../services/theme.service";
import { GetHomePage } from "../action/theme.action";

export class ThemesStateModel {
  homePage: object | null;
}

@State<ThemesStateModel>({
  name: "theme",
  defaults: {
    homePage: null
  },
})
@Injectable()
export class ThemeState {

  constructor(private router: Router, 
    private themeService: ThemeService) {}

  @Selector()
  static homePage(state: ThemesStateModel) {
    return state.homePage;
  }

  @Action(GetHomePage)
  getHomePage(ctx: StateContext<ThemesStateModel>, action: GetHomePage) {
    return this.themeService.getHomePage(action?.slug).pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            homePage: result
          });
        },
        error: (err) => {
          this.router.navigate(['/404']);
          throw new Error(err?.error?.message);
        },
      })
    );
  }

}
