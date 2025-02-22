import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ReviewModel } from '../interface/review.interface';
import { environment } from 'src/environments/environment';
import { AuthState } from '../state/auth.state';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  skeletonLoader: boolean;


  constructor(private http: HttpClient, private store: Store) {}
  getToken(): string | null {
   
    return this.store.selectSnapshot(AuthState.token); 
  }
 
   
getReview(slug: any): Observable<ReviewModel> {
  return this.http.get<ReviewModel>(`${environment.configUrl}getReview/${slug.product_id}`);
}

// addReview(payload: Params): Observable<ReviewModel> {
//   return this.http.post<ReviewModel>(`${environment.configUrl}addReview`, payload)
// }
addReview(payload: Params): Observable<ReviewModel> {
  const token = this.getToken();
          if (!token) {
            throw new Error("No token found");
          }
          const headers = new HttpHeaders({
            Authorization: `${token}`,
          });
  return this.http.post<ReviewModel>(`${environment.configUrl}addReview`, payload,{headers});
}

updateReview(id: number, payload: Params): Observable<ReviewModel> {
  const token = this.getToken();
          if (!token) {
            throw new Error("No token found");
          }
          const headers = new HttpHeaders({
            Authorization: `${token}`,
          });
  return this.http.put<ReviewModel>(`${environment.configUrl}updateReview/${id}`,payload,{headers});
}

}