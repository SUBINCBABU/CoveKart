import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { WithdrawalModel } from '../interface/withdrawal.interface';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {

  constructor(private http: HttpClient) {}

  getWithdrawRequest(payload?: Params): Observable<WithdrawalModel> {
    return this.http.get<WithdrawalModel>(`${environment.URL}/withdraw.json`, { params: payload });
  }
  
}
