import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient) { }


  getHomePage(slug?: string): Observable<any> {
    if(!slug) {
      slug = 'rome';
    }
    return this.http.get(`${environment.configUrl}getRomeTheme/${slug}`);
  }

}
