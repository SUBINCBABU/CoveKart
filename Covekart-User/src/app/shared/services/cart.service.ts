import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Cart, CartAddOrUpdate, CartModel } from "../interface/cart.interface";
import { AuthState } from "../state/auth.state";
import { Store } from "@ngxs/store";

@Injectable({
  providedIn: "root",
})
export class CartService {

  constructor(private http: HttpClient , private store:Store) { }
getToken(): string | null {
   
    return this.store.selectSnapshot(AuthState.token); 
  }

  getCartItems(): Observable<CartModel> {
     const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const headers = new HttpHeaders({
        Authorization: `${token}`,
      });
    return this.http.get<CartModel>(`${environment.configUrl}getCart`,{ headers });
  }


  add(payload: CartAddOrUpdate): Observable<Cart> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.post<Cart>(`${environment.configUrl}createCart`, payload,{headers});
  }
  

  
  delete(id: number): Observable<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.delete<void>(`${environment.configUrl}deleteCart/${id}`,{headers});
  }
}
