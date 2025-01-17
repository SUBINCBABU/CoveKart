import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { CartModel, CartAddOrUpdate } from "../interface/cart.interface";

@Injectable({
  providedIn: "root",
})
export class CartService {

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<CartModel> {
    return this.http.get<CartModel>(`${environment.configUrl}getCart`);
  }

}
