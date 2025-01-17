import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { TransactionsPayload, VenderWallet } from '../interface/vendor-wallet.interface';

@Injectable({
  providedIn: 'root'
})
export class VendorWalletService {

  constructor(private http: HttpClient) {}

  getVendorTransaction(payload?: Params): Observable<VenderWallet> {
    return this.http.get<VenderWallet>(`${environment.URL}/wallet.json`, { params: payload });
  }
  
}
