import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '../interface/core.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QnAModel, QuestionAnswers } from '../interface/questions-answers.interface';
import { AuthState } from '../state/auth.state';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class QuestionsAnswersService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient, private store: Store) {}
   getToken(): string | null {
    
     return this.store.selectSnapshot(AuthState.token); 
   }
    

  getQuestionAnswers(slug: Params): Observable<QnAModel> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.get<QnAModel>(`${environment.configUrl}getQuestion/${slug['product_id']}`,{headers});
  }

  sendQuestion(payload: Params): Observable<QnAModel> {
     const token = this.getToken();
              if (!token) {
                throw new Error("No token found");
              }
              const headers = new HttpHeaders({
                Authorization: `${token}`,
              });
    return this.http.post<QnAModel>(`${environment.configUrl}sendQuestion`, payload,{headers})
  }

  updateQuestion(id: number, payload: Params): Observable<QnAModel> {
    const token = this.getToken();
              if (!token) {
                throw new Error("No token found");
              }
              const headers = new HttpHeaders({
                Authorization: `${token}`,
              });
    return this.http.post<QnAModel>(`${environment.configUrl}updateQuestionAnswers/${id}`,payload,{headers});
  }

  sendFeedback(payload: Params): Observable<QnAModel> {
    return this.http.post<QnAModel>(`${environment.configUrl}feedback`,payload);
  }


}
