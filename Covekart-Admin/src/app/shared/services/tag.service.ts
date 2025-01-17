import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Tag, TagModel } from "../interface/tag.interface";

@Injectable({
  providedIn: "root",
})
export class TagService {

  constructor(private http: HttpClient) { }
  
  getTags(payload?: Params): Observable<TagModel> {
    return this.http.get<TagModel>(`${environment.configUrl}getTags`, { params: payload });
  }


  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`${environment.configUrl}createTag`, tag);
  }

  updateTag(id: number, payload: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${environment.configUrl}updateTag/${id}`, payload);
  }
  deleteTag(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.configUrl}deleteTag/${id}`);
  }

  updateTagStatus(id: number, status: boolean): Observable<Tag> {
    return this.http.patch<Tag>(`${environment.configUrl}updateTagStatus/${id}`, { status }).pipe(
      catchError((error) => {
        console.error('Error updating tag status', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update tag status'));
      })
    );
  }

  deleteAllTags(ids: number[]): Observable<any> {
    return this.http.post<any>(`${environment.configUrl}deleteTags`, { ids }).pipe(
      catchError((error) => {
        console.error('Error deleting tags', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete tags'));
      })
    );
  }





}
