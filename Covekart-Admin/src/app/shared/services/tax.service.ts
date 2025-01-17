import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Tax, TaxModel } from "../interface/tax.interface";

@Injectable({
  providedIn: "root",
})
export class TaxService {

  constructor(private http: HttpClient) {}
  
  getTaxes(payload?: Params): Observable<TaxModel> {
    return this.http.get<TaxModel>(`${environment.configUrl}getTax`, { params: payload });
  }

  createTax(payload: Tax): Observable<Tax> {
    return this.http.post<Tax>(`${environment.configUrl}createTax`, payload);
  }

  updateTax(id: number, payload: Tax): Observable<Tax> {
    return this.http.put<Tax>(`${environment.configUrl}updateTax/${id}`, payload);
  }
  
  updateTaxStatus (id: number, status: boolean): Observable<Tax> {
    return this.http.patch<Tax>(`${environment.configUrl}updateTaxStatus/${id}`, { status })
  }
  
  deleteTax(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.configUrl}deleteTax/${id}`);
  }
  deleteAllTaxes(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllTax`, { ids });
  }
  
  
}
