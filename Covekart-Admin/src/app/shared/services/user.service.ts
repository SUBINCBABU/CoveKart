import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { User, UserAddress, UserModel } from "../interface/user.interface";
import { Store } from "@ngxs/store";


@Injectable({
  providedIn: "root",
})
export class UserService {

  constructor(private http: HttpClient, private store:Store) { }



  getUsers(payload?: Params): Observable<UserModel> {
    console.log(this.store);
    
    return this.http.get<UserModel>(`${environment.configUrl}getUsers`, { params: payload });
  }

  createUser(payload: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.configUrl}createUsers`, payload);
  }

  updateUser(id: Number, payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.configUrl}updateUsers/${id}`, payload);
  }

  updateUserStatus(id: number, status: boolean): Observable<User> {
    return this.http.patch<User>(`${environment.configUrl}updateUsersStatus/${id}`, { status }).pipe(
      catchError((error) => {
        console.error('Error updating user status', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update user status'));
      })
    );
  }
  deleteUser(id: Number): Observable<any> {
    return this.http.delete<any>(`${environment.configUrl}deleteUser/${id}`);
  }

  deleteAllUsers(ids: Number[]): Observable<any> {
    return this.http.post(`${environment.configUrl}deleteAllUsers`, { ids });
  }


}
