import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Shipping, ShippingRule } from "../interface/shipping.interface";

@Injectable({
  providedIn: "root",
})
export class ShippingService {

  constructor(private http: HttpClient) {}
  

  getShippings(payload?: Params): Observable<Shipping[]> {
    return this.http.get<Shipping[]>(`${environment.configUrl}getShipping`, { params: payload });
  }

  createShipping(payload: Shipping): Observable<Shipping> {
    return this.http.post<Shipping>(`${environment.configUrl}createShipping`, payload);
  }


  getShippingById(id: number): Observable<Shipping> {
    return this.http.get<Shipping>(`${environment.configUrl}editShipping/${id}`);
  }

  updateShipping(payload: Shipping, id: number): Observable<Shipping> {
    return this.http.put<Shipping>(`${environment.configUrl}updateShipping/${id}`, payload);
  }

  deleteShipping(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.configUrl}deleteShipping/${id}`);
  }

  createShippingRule(payload: ShippingRule): Observable<ShippingRule> {
    return this.http.post<ShippingRule>(`${environment.configUrl}createShippingRule`, payload);
  }



    updateShippingRule(id: Number, payload: ShippingRule): Observable<ShippingRule> {
      return this.http.put<ShippingRule>(`${environment.configUrl}updateShippingRules/${id}`, payload);
    }


    deleteShippingRule(id: number): Observable<void> {
      return this.http.delete<void>(`${environment.configUrl}deleteShippinRule/${id}`);
    }
  

}
