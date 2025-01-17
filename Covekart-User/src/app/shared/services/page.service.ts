import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { ContactUsModel } from "../interface/page.interface";

@Injectable({
  providedIn: "root",
})
export class PageService {

  public skeletonLoader: boolean = false;
  
  constructor(private http: HttpClient) {}

  getFaqs(): Observable<any> {
    return this.http.get(`${environment.URL}/faq.json`);
  }
  
}
