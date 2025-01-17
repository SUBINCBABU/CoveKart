import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompareModel } from '../interface/compare.interface';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  public skeletonLoader: boolean = false;
  
  constructor(private http: HttpClient) { }
 
  getCompareItems(): Observable<CompareModel> {
    return this.http.get<CompareModel>(`${environment.baseURL}getCompare`);
  }

}
