import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutPayload, OrderCheckout, OrderModel, PlaceOrder } from '../interface/order.interface';
import { Params } from '../interface/core.interface';
import { Store } from '@ngxs/store';
import { AuthState } from '../state/auth.state';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient , private store:Store) {}
   getToken(): string | null {
     
      return this.store.selectSnapshot(AuthState.token); 
    }




    getOrders(payload?: Params): Observable<OrderModel> {
      const token = this.getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const headers = new HttpHeaders({
          Authorization: `${token}`,
        });
      return this.http.get<OrderModel>(`${environment.configUrl}getOrders`, { params: payload ,headers});
    }
    getOrderById(id: number,): Observable<OrderModel> {
      const token = this.getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const headers = new HttpHeaders({
          Authorization: `${token}`,
        });
      return this.http.get<OrderModel>(`${environment.configUrl}details/${id}`,{headers});
    }
  
    placeOrder(payload: CheckoutPayload): Observable<PlaceOrder> {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const headers = new HttpHeaders({
        Authorization: `${token}`,
      });
      return this.http.post<PlaceOrder>(`${environment.configUrl}orderPlace`, payload,{headers});
    }
  
    checkout(payload: CheckoutPayload): Observable<OrderCheckout> {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const headers = new HttpHeaders({
        Authorization: `${token}`,
      });
      return this.http.post<OrderCheckout>(`${environment.configUrl}orderCheckout`, payload,{headers});
    }
  
}
