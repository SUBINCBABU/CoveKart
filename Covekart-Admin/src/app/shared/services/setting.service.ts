import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { Setting, Values } from '../interface/setting.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }
 
  getSettingOption(): Observable<Setting> {
    return this.http.get<Setting>(`${environment.configUrl}getSettings`);
  }


  // getBackendSettingOption(): Observable<Setting> {
  //   return this.http.get<Setting>(`${environment.URL}/setting.json`);
  // }

  getBackendSettingOption(): Observable<Setting> {
    return this.http.get<Setting>(`${environment.configUrl}getSettings`);
  }

 
  updateSettingOption(payload: Values): Observable<any> {
    return this.http.put(`${environment.configUrl}updateSettings`, payload);
  }
}
