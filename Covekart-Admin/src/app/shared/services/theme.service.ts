import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { ThemesModel } from '../interface/theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient) { }



  getThemes(): Observable<ThemesModel> {
    return this.http.get<ThemesModel>(`${environment.configUrl}getTheme`);
  }
 



  getHomePage(slug?: string): Observable<any> {
    if(!slug) {
      slug = 'rome';
    }
    
    return this.http.get(`${environment.configUrl}getRomeTheme/${slug}`);
  }




  updateTheme(id: number, status: number | boolean): Observable<any> {
    return this.http.put(`${environment.configUrl}updateTheme/${id}`, { status });
  }
  
  updateHomePage(id: number, payload: any): Observable<any> {
    return this.http.put(`${environment.configUrl}updateHomePage/${id}`, payload);
  }

 
}
