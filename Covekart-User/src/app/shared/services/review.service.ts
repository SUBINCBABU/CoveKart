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
 

   
  getReview(slug: any): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${environment.configUrl}getReview/${slug.product_id}`);
  }

  addReview(payload: Params): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(`${environment.configUrl}addReview`, payload)
  }

}