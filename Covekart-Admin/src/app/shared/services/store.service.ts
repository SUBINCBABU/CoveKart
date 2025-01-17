import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Stores, StoresModel } from "../interface/store.interface";
import { Store } from "@ngxs/store";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  notificationService: any;

  constructor(private http: HttpClient) {}
  

  createStore(payload: Stores): Observable<Stores> {
    return this.http.post<Stores>(`${environment.configUrl}createStore`, payload);
  }

  getStores(payload?: Params): Observable<StoresModel> {
    return this.http.get<StoresModel>(`${environment.configUrl}getStores`, { params: payload });
  }
  getStoreById(id: number): Observable<Stores> {
    return this.http.get<Stores>(`${environment.configUrl}editStore/${id}`);
  }
  
  updateStore(payload: Stores, id: Number): Observable<Stores> {
    return this.http.put<Stores>(`${environment.configUrl}updateStore/${id}`, payload);
  }
 
  updateStoreStatus(id: number, status: boolean): Observable<Stores> {
   
     return this.http.patch<Stores>(`${environment.configUrl}updateStoreStatus/${id}`, { status })
  }
  
  approveStoreStatus(id: number, is_approved: boolean): Observable<Stores> {
    return this.http.patch<Stores>(`${environment.configUrl}approveStoreStatus/${id}`, { is_approved });
  }
  
  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.configUrl}deleteStore/${id}`);
  }
  deleteAllStores(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllStores`, { ids });
  }
    

}
