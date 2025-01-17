import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { AccountClear, GetUserDetails } from "../action/account.action";
import { Register, Login, ForgotPassWord, VerifyEmailOtp, UpdatePassword, Logout, AuthClear } from "../action/auth.action";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";
import { AuthUserForgotModel, AuthUserStateModel, RegisterModal, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { tap, catchError } from "rxjs/operators";
import { of, throwError } from 'rxjs';

export interface AuthStateModel {
  email: string;
  token: string | null;
  access_token: string | null;
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    access_token: ''
  },
})
@Injectable()
export class AuthState {
  static access_token(access_token: any): string | null {
    throw new Error("Method not implemented.");
  }
  static auth(auth: any) {
    throw new Error("Method not implemented.");
  }

  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationService,
    private service: AuthService
  ) { }

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      email: '',
      token: '',
      access_token: ''
    });
  }

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel): string {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }


  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, { payload }: Register) {
    return this.service.postRegisterService(payload).pipe(
      tap((res: RegisterModal) => {

        ctx.patchState({ email: res.email });


        this.router.navigate(['/auth/success']);
      }),
      catchError((error) => {

        console.error("Registration error:", error);

        const errorMessage = error?.message || "An unexpected error occurred during registration.";
        this.notificationService.showError("Registration failed", errorMessage);


        return throwError(() => new Error(errorMessage));
      })
    );
  }


  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { payload }: Login) {
    return this.service.postLoginService(payload).pipe(
      tap((res: AuthUserStateModel) => {
        ctx.patchState({ email: res.email, access_token: res.token, token: res.token });
        this.store.dispatch(new GetUserDetails());
      }),
      catchError(error => {
        console.error("Login error:", error);

        const errorMessage = error?.message || "An unexpected error occurred during login.";
        this.notificationService.showError("Login failed", errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }




  @Action(ForgotPassWord)
  forgotPassword(ctx: StateContext<AuthStateModel>, { payload }: ForgotPassWord) {
    return this.service.postForgotPasswordService(payload).pipe(
      tap((res: AuthUserForgotModel) => ctx.patchState({ email: res.email })),
      catchError(error => {
        this.notificationService.showError("Password reset request failed", error.message);
        return of(error);
      })
    );
  }

  @Action(VerifyEmailOtp)
  verifyEmail(ctx: StateContext<AuthStateModel>, { payload }: VerifyEmailOtp) {
    return this.service.postOtpService(payload).pipe(
      tap((res: VerifyEmailOtpModel) => ctx.patchState({ email: res.email })),
      catchError(error => {
        this.notificationService.showError("OTP verification failed", error.message);
        return of(error);
      })
    );
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AuthStateModel>, { payload }: UpdatePassword) {
    return this.service.postUpdatePasswordService(payload).pipe(
      tap((res: UpdatePasswordModel) => ctx.patchState({ email: res.email })),
      catchError(error => {
        this.notificationService.showError("Password update failed", error.message);
        return of(error);
      })
    );
  }



  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.service.logout().pipe(
      tap(() => {

        ctx.patchState({
          email: '',
          token: '',
          access_token: null,

        });

        this.store.dispatch(new AccountClear())
        localStorage.removeItem("token");
        this.router.navigate(['/auth/login']).then(() => {
          window.location.reload();
        });
        this.notificationService.success("You have been logged out successfully.");
      }),
      catchError((error) => {

        console.error("Logout failed:", error);
        this.notificationService.error("Failed to log out. Please try again.");
        return of(error);
      })
    );
  }
  @Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>) {

    ctx.patchState({
      email: '',
      token: '',
      access_token: null,

    });

    this.store.dispatch(new AccountClear());
  }
}
