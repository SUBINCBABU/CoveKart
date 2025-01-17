import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Category, CategoryModel } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private http: HttpClient) {}
 
  getCategories(payload?: Params): Observable<CategoryModel> {
    const params = payload ? { ...payload } : {};
    return this.http.get<CategoryModel>(`${environment.configUrl}getCategory`, { params });
  }
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${environment.configUrl}createCategory`, category);
  }

  editCategory(id: number): Observable<Category> {
    const url = `${environment.configUrl}getCategoryUpdate/${id}`; // id is passed as a path parameter
    return this.http.get<Category>(url);
  }
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${environment.configUrl}updateCategory/${id}`, category);
  }


  deleteCategory(id: number): Observable<any> {
    const url = `${environment.configUrl}deleteCategory/${id}`; 
    return this.http.delete(url);
  }

}
