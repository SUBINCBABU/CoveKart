import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Attachment, AttachmentModel } from "../interface/attachment.interface";

@Injectable({
  providedIn: "root",
})
export class AttachmentService {

  constructor(private http: HttpClient) { }
  

  getAttachments(payload?: Params): Observable<AttachmentModel> {
    const params = payload ? new HttpParams({ fromObject: payload }) : new HttpParams();
    return this.http.get<AttachmentModel>(`${environment.configUrl}getImages`, { params });
  }



  uploadFiles(files: File[]): Observable<Attachment[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    const uploadUrl = `${environment.configUrl}createImages`;

    return this.http.post<{ message: string, files: Attachment[] }>(uploadUrl, formData).pipe(
      map(response => {
        if (response && response.files && Array.isArray(response.files)) {
          return response.files;
        }
        throw new Error('Unexpected response structure');
      }),
      catchError((error) => {
        console.error('Error uploading files:', error);

        return throwError(() => new Error('Failed to upload files'));
      })
    );
  }


  deleteAttachment(id: number): Observable<void> {
    const url = `${environment.configUrl}deleteImage/${id}`;
    return this.http.delete<void>(url);
  }




deleteAttachments(ids: number[]): Observable<Attachment[]> {
  const url = `${environment.configUrl}deleteImages`; 
  return this.http.post<{ message: string; deletedFiles: Attachment[] }>(url, { ids }).pipe(
    map((response) => response.deletedFiles)
  );
}
  
}  