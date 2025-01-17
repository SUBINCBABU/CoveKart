import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Product, ProductModel } from "../interface/product.interface";

@Injectable({
  providedIn: "root",
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${environment.configUrl}getProducts`, { params });
  }


  createProduct(payload: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.configUrl}createProduct`, payload);
  }


  getProductById(id: Number): Observable<Product> {
    return this.http.get<Product>(`${environment.configUrl}getProduct/${id}`);
  }



  updateProduct(id: number, payload: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.configUrl}updateProduct/${id}`, payload);
  }



  // // Update product status
  updateProductStatus(id: number, status: boolean) {
    return this.http.patch(`${environment.configUrl}updateProductStatus/${id}`, { status });
  }


  approveProductStatus(id: number, is_approved: boolean) {
    return this.http.patch(`${environment.configUrl}approveProductStatus/${id}`, { is_approved });
  }


  // Delete a product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${environment.configUrl}deleteProduct/${id}`);
  }

  // // Delete multiple products
  deleteAllProducts(ids: number[]): Observable<any> {
    return this.http.post(`${environment.configUrl}deleteAllProduct`, { ids });
  }

  // // Replicate products
  // replicateProduct(ids: number[]): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/replicate`, { ids });
  // }

}
