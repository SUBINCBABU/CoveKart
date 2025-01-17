import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { ReviewModel } from '../interface/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}
  

  getReviews(payload?: Params): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${environment.configUrl}getReviews`, { params: payload });
  }

  deleteReviews(id?: number): Observable<ReviewModel> {
    return this.http.delete<ReviewModel>(`${environment.configUrl}deleteReviews/${id}`,);
  }

  deleteAllReviews(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllReviews`,{ ids });
  }
  
}
