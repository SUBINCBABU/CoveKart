import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '../interface/core.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QnAModel, QuestionAnswers } from '../interface/questions-answers.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionsAnswersService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) { }


  getQuestionAnswers(slug: Params): Observable<QnAModel> {
    return this.http.get<QnAModel>(`${environment.configUrl}getQuestion/${slug['product_id']}`,);
  }

  sendQuestion(payload: Params): Observable<QnAModel> {
    return this.http.post<QnAModel>(`${environment.configUrl}sendQuestion`, payload)
  }

  updateQuestion(id: number, payload: Params): Observable<QnAModel> {
    return this.http.post<QnAModel>(`${environment.configUrl}updateQuestionAnswers/${id}`, payload);
  }

  sendFeedback(payload: Params): Observable<QnAModel> {
    return this.http.post<QnAModel>(`${environment.configUrl}feedback`,payload);
  }


}
