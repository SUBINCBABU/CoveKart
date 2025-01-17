import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { catchError, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { ForgotPassWord, Login, VerifyEmailOtp, UpdatePassword, Logout, AuthClear } from "../action/auth.action";
import { AccountClear } from "../action/account.action";
import { GetBadges } from "../action/menu.action";
import { GetSettingOption } from "../action/setting.action";
import { GetUsers } from "../action/user.action";
import { GetCountries } from "../action/country.action";
import { GetStates } from "../action/state.action";
import { GetNotification } from "../action/notification.action";
import { NotificationService } from "../services/notification.service";
import { UserModel } from "../interface/user.interface";
import { of } from "rxjs";

export interface AuthStateModel {
  email: string;
  token: string | number;
  access_token: string | null;
  permissions:any [];
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    access_token: '',
    permissions: [],
  },
})
@Injectable()
export class AuthState {
  
  constructor(private store: Store,
    public router: Router,
    private notificationService: NotificationService,
    private authService: AuthService) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    // Pre Fake Login (if you are using ap
    ctx.patchState({
      email: '',
      token: '',
      access_token: ''
    })
  }

  @Selector()
  static accessToken(state: AuthStateModel) {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }



  @Action(Login)
login(ctx: StateContext<AuthStateModel>, action: Login) {
  return this.authService.postAdminLogin(action.payload).pipe(
    tap((response) => {
     console.log(response);
     
      ctx.patchState({
        email: response.email,
        token: response.token,
        access_token: response.access_token,
        permissions: response.permissions,
      });
      // Navigate to dashboard or other protected route
      this.router.navigate(["/dashboard"]);
      
    }),
    catchError((error) => {
      // Handle login error (e.g., show a notification)
      this.notificationService.error("Login failed. Please check your credentials.");
      return of(error); // Return observable with error
    })
  );
}

  
  @Action(ForgotPassWord)
  forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassWord) {
    // Forgot Password Logic Here
  }

  @Action(VerifyEmailOtp)
  verifyEmail(ctx: StateContext<AuthStateModel>, action: VerifyEmailOtp) {
    // Verify Email Logic Here
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AuthStateModel>, action: UpdatePassword) {
    // Update Password Logic Here
  }

  // @Action(Logout)
  // logout(ctx: StateContext<AuthStateModel>) {
  //   // Logout Logic Here
  // }


  @Action(Logout)
logout(ctx: StateContext<AuthStateModel>) {
  return this.authService.logout().pipe(
    tap(() => {
      // Clear auth state
      ctx.patchState({
        email: '',
        token: '',
        access_token: null,
        permissions: [],
      });

      // Dispatch AccountClear to clear account-related state
      this.store.dispatch(new AccountClear());

      // Navigate to login page
      // this.router.navigate(['/auth/login']);
      this.router.navigate(['/auth/login']).then(() => {
        window.location.reload();
      });
      

      // Notify the user
      this.notificationService.success("You have been logged out successfully.");
    }),
    catchError((error) => {
      // Handle logout errors
      console.error("Logout failed:", error);
      this.notificationService.error("Failed to log out. Please try again.");
      return of(error); // Return observable with error
    })
  );
}


  // @Action(AuthClear)
  // authClear(ctx: StateContext<AuthStateModel>){
  //   ctx.patchState({
  //     email: '',
  //     token: '',
  //     access_token: null,
  //     permissions: [],
  //   });
  //   this.store.dispatch(new AccountClear());
  // }




  @Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>) {
    // Clear auth state
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
      permissions: [],
    });
  
    // Dispatch AccountClear to reset account state
    this.store.dispatch(new AccountClear());
  }
  

}
