import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Attribute, AttributeModel, AttributeValueModel } from "../interface/attribute.interface";

@Injectable({
  providedIn: "root",
})
export class AttributeService {

  constructor(private http: HttpClient) {}
  

  getAttributes(payload?: Params): Observable<AttributeModel> {
    return this.http.get<AttributeModel>(`${environment.configUrl}getAttribute`, { params: payload });
  }

  getAttributeValues(payload?: Params): Observable<AttributeValueModel> {
    return this.http.get<AttributeValueModel>(`${environment.URL}/attribute-value.json`, { params: payload });
  }


  createAttribute(attribute: Attribute): Observable<Attribute> {
    return this.http.post<Attribute>(`${environment.configUrl}createAttribute`, attribute);
  }


  updateAttribute(id: number, payload: Attribute): Observable<Attribute> {
    return this.http.put<Attribute>(`${environment.configUrl}updateAttribute/${id}`, payload);
  }
  
  deleteAttribute(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.configUrl}deleteAttribute/${id}`);
  }


  deleteAttributes(ids: number[]): Observable<any> {
    return this.http.post<any>(`${environment.configUrl}deleteAttributes`, { ids }).pipe(
      catchError((error) => {
        console.error('Error deleting attributes', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete attributes'));
      })
    );
  }
  

}
