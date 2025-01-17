import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Params } from "../interface/core.interface";
import { environment } from "../../../environments/environment";
import { StoresModel } from "../interface/store.interface";

@Injectable({
  providedIn: "root",
})
export class StoreService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) {}

  getStores(payload?: Params): Observable<StoresModel> {
    return this.http.get<StoresModel>(`${environment.configUrl}getStore`, { params: payload });
  }

}
