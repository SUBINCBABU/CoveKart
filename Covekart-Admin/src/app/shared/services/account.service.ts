import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountUser, AccountUserUpdatePassword } from "../interface/account.interface";
import { Stores } from "../interface/store.interface";
import { Store } from "@ngxs/store";
import { AuthState } from "../state/auth.state";

@Injectable({
  providedIn: "root",
})
export class AccountService {

  constructor(private http: HttpClient, private store: Store) { }
  getToken(): string | Number {
    return this.store.selectSnapshot(AuthState.token);
  }

  getUserDetails(): Observable<AccountUser> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.get<AccountUser>(`${environment.configUrl}getAccount`, { headers });
  }


  updateUserProfile(payload: AccountUser): Observable<AccountUser> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.put<AccountUser>(`${environment.configUrl}updateProfile`, payload,{headers});
  }

  updateUserPassword(payload: AccountUserUpdatePassword): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.put(`${environment.configUrl}putUpdatePassword`, payload,{headers});
  }


  updateStoreDetails(storeData: Partial<Stores>): Observable<Stores> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.put<Stores>(`${environment.configUrl}updateStore`, storeData,{headers});
  }

}
