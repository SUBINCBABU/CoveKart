import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Role, RoleModel, Module } from "../interface/role.interface";

@Injectable({
  providedIn: "root",
})
export class RoleService {

  constructor(private http: HttpClient) {}
 

  getRoleModules(): Observable<Module[]> {
    return this.http.get<Module[]>(`${environment.configUrl}getRoleModules`).pipe(
      tap((modules) => {
       
      }),
      catchError((error) => {
        console.error("Error fetching role modules:", error.message);
        return throwError(() => new Error("Failed to fetch role modules. Please try again later."));
      })
    );
  }
  

  getRoles(payload?: Params): Observable<RoleModel> {
    const options = payload ? { params: payload as any } : {}; 
  
    return this.http.get<RoleModel>(`${environment.configUrl}getRoles`, options).pipe(
      catchError((error) => {
        console.error("Error fetching roles:", error.message);
        return throwError(() => new Error("Failed to fetch roles. Please try again later."));
      })
    );
  }
  



  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${environment.configUrl}createRole`, role);
  }
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${environment.configUrl}getRole/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching role with ID ${id}:`, error.message);
        return throwError(() => new Error(`Failed to fetch role with ID ${id}. Please try again later.`));
      })
    );
  }
  


  updateRole(id: number, payload: Role): Observable<Role> {
    return this.http.put<Role>(`${environment.configUrl}updateRole/${id}`, payload);
  }


  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${environment.configUrl}deleteRole/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting role:', error);
        return throwError(() => new Error('Failed to delete role.'));
      })
    );
  }
  
  deleteAllRoles(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllRoles`, { ids }).pipe(
      catchError((error) => {
        console.error('Error deleting roles:', error);
        return throwError(() => new Error('Failed to delete roles. Please try again later.'));
      })
    );
  }
  
  
}
