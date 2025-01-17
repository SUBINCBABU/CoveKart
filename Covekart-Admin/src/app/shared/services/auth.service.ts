import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthUserForgotModel, AuthUserStateModel, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { UpdatePassword } from "../action/auth.action";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  notificationService: any;

  constructor(private http: HttpClient) { }
  

  postAdminLogin(payload: AuthUserStateModel): Observable<{ access_token: string; token: string | number; email: string; permissions: any[] }> {
    return this.http.post<{ access_token: string; token: string | number; email: string; permissions: any[] }>(
      `${environment.configUrl}adminLogin`,
      payload
    );
  }
 
  logout(): Observable<any> {
    return this.http.post(`${environment.configUrl}adminLogout`, {});
  }

}
