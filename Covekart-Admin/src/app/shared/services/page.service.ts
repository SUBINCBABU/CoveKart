import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Page, PageModel } from "../interface/page.interface";

@Injectable({
  providedIn: "root",
})
export class PageService {

  constructor(private http: HttpClient) { }
  
  getPages(payload?: Params): Observable<PageModel> {
    return this.http.get<PageModel>(`${environment.configUrl}getPages`, { params: payload });
  }

  createPages(payload?: Page): Observable<Page> {
    return this.http.post<Page>(`${environment.configUrl}createPages`, payload);
  }

  EditPage( id?: number): Observable<Page>{
    return this.http.get<Page>(`${environment.configUrl}editPages/${id}`,);
  }

  UpdatePage( id?: number,payload?:Page): Observable<Page>{
    return this.http.post<Page>(`${environment.configUrl}updatePages/${id}`,payload);
  }

  DeletePage( id?: number): Observable<Page>{
    return this.http.delete<Page>(`${environment.configUrl}deletePages/${id}`,);
  }

  deleteAllPages(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllPages`, { ids });
  }
  updatePageStatus( id: number,status: boolean) :Observable<Page>{
    return this.http.post<Page>(`${environment.configUrl}updatePageStatus/${id}`,{status});
  }

}
