import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Currency, CurrencyModel } from "../interface/currency.interface";

@Injectable({
  providedIn: "root",
})
export class CurrencyService {

  constructor(private http: HttpClient) {}
  

  getCurrencies(payload?: Params): Observable<CurrencyModel> {
    return this.http.get<CurrencyModel>(`${environment.configUrl}getCurrency`, { params: payload });
  }

  createCurrency(currency: Currency): Observable<Currency> {
    return this.http.post<Currency>(`${environment.configUrl}createCurrency`, currency);
  }

  edit(id: number): Observable<Currency> {
      return this.http.get<Currency>(`${environment.configUrl}editCurrency/${id}`);
    }

  updateCurrency(currency: Currency, id: number): Observable<Currency> {
    return this.http.put<Currency>(`${environment.configUrl}updateCurrency/${id}`, currency);
  }
  updateCurrencyStatus(id: number, status: boolean): Observable<{ status: boolean }> {
    return this.http.patch<{ status: boolean }>(`${environment.configUrl}updateCurrencyStatus/${id}`, { status });
  }

  deleteCurrency(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.configUrl}deleteCurrency/${id}`);
  }

  deleteAllCurrencies(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllCurrency`, { ids });
  }

}
