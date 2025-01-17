import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { Faq, FaqModel } from '../interface/faq.interface';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http: HttpClient) {}

  getFaqs(payload?: Params): Observable<FaqModel> {
    return this.http.get<FaqModel>(`${environment.configUrl}getFaqs`, { params: payload });
  }
  createFaqs(payload?: Faq): Observable<Faq> {
    return this.http.post<Faq>(`${environment.configUrl}createFaqs`, payload);
  }

  EditFaq(id?: number): Observable<Faq> {
    return this.http.get<Faq>(`${environment.configUrl}editFaq/${id}`);
  }

  UpdateFaq(id?: number, payload?: Faq): Observable<Faq> {
    return this.http.post<Faq>(`${environment.configUrl}updateFaq/${id}`, payload);
  }

  DeleteFaq(id?: number): Observable<Faq> {
    return this.http.delete<Faq>(`${environment.configUrl}deleteFaq/${id}`,);
  }

  deleteAllFaq(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllFaq`, { ids });
  }
  updateFaqStatus(id: number, status: boolean): Observable<Faq> {
    return this.http.post<Faq>(`${environment.configUrl}updateFaqStatus/${id}`, { status });
  }


}
