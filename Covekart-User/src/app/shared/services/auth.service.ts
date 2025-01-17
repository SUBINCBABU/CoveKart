import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthUserForgotModel, AuthUserStateModel, RegisterModal, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  static postLogoutService(token: String | Number) {
    throw new Error("Method not implemented.");
  }

  public redirectUrl: string | undefined;
  
  constructor(private http: HttpClient) { }

  postRegisterService(payload: RegisterModal) {
   
    return this.http.post<RegisterModal>(`${environment.configUrl}signup`, payload);
    
    
  }
  postOtpService(payload: VerifyEmailOtpModel) {
    return this.http.post<VerifyEmailOtpModel>(`${environment.configUrl}signup/verify`, payload);
    
    
  }

  postLoginService(payload: AuthUserStateModel) {
    return this.http.post<AuthUserStateModel>(`${environment.configUrl}login`, payload);
  }


  postForgotPasswordService(payload: AuthUserForgotModel) {
    return this.http.post<AuthUserForgotModel>(`${environment.configUrl}forgotPassword`, payload); 
  }


  postUpdatePasswordService(payload: UpdatePasswordModel) {
    return this.http.post<UpdatePasswordModel>(`${environment.configUrl}updatePassword`, payload);
  }
  
  logout(): Observable<any> {
    return this.http.post(`${environment.configUrl}userLogout`, {});
  }
  
  
}
