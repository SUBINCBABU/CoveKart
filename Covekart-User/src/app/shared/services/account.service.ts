import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AccountUser } from "../interface/account.interface";
import { CreateAddress } from "../action/account.action";
import { UserAddress } from "../interface/user.interface";
import { environment } from "../../../environments/environment";
import { Store } from "@ngxs/store";
import { AuthState } from "../state/auth.state";

@Injectable({
  providedIn: "root",
})
export class AccountService {

 
  constructor(private http: HttpClient, private store: Store) {}
  getToken(): string | null {
   
    return this.store.selectSnapshot(AuthState.token); 
  }

// getUserDetails(): Observable<AccountUser> {
//   const token = this.getToken();
//   console.log("token ",token);
  
//   return this.http.get<AccountUser>(`${environment.configUrl}getUserAccount`,token);
// }



getUserDetails(): Observable<AccountUser> {
  const token = this.getToken();
  if (!token) {
    throw new Error("No token found");
  }
  const headers = new HttpHeaders({
    Authorization: `${token}`,
  });
  return this.http.get<AccountUser>(`${environment.configUrl}getUserAccount`, { headers });
}



  postUserAddressServivice(payload:UserAddress) {
    const token = this.getToken();
  if (!token) {
    throw new Error("No token found");
  }
  const headers = new HttpHeaders({
    Authorization: `${token}`,
  });
    return this.http.post<UserAddress>(`${environment.configUrl}createUserAddress`,payload,{headers});
  }


  updateUserAddressService(payload: UserAddress, id: number): Observable<UserAddress> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.put<UserAddress>(`${environment.configUrl}updateAddress/${id}`, payload,{headers});
  }
    
  deleteAddress(id: number): Observable<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.delete<void>(`${environment.configUrl}deleteAddress/${id}`,{headers});
  }       
  
   
  updateUserProfileService(payload: Partial<AccountUser>): Observable<AccountUser> {
    return this.http.put<AccountUser>(`${environment.configUrl}updateUserProfile`, payload);
  }


}
