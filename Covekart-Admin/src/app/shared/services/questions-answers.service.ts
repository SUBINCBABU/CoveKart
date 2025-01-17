import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Params } from '../interface/core.interface';
import { QnAModel, QuestionAnswers } from '../interface/questions-answers.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionsAnswersService {

  constructor(private http: HttpClient) { }
  getQuestionAnswers(payload: Params): Observable<QnAModel> {
    return this.http.get<QnAModel>(`${environment.configUrl}getQuestions`, payload);
  }

  EditQuestionAnswers(id?: number): Observable<QuestionAnswers> {
    return this.http.get<QuestionAnswers>(`${environment.configUrl}editQuestionAnswers/${id}`);
  }

  UpdateQuestionAnswers(id?: number, payload?: Params): Observable<QuestionAnswers> {
    return this.http.post<QuestionAnswers>(`${environment.configUrl}updateQuestion/${id}`, payload);
  }
  DeleteQuestionAnswers(id?: number): Observable<QuestionAnswers> {
    return this.http.delete<QuestionAnswers>(`${environment.configUrl}deleteQuestionAnswers/${id}`,);
  }

  deleteAllQuestionAnswers(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllQuestionAnswers`, { ids });
  }

}
