import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Coupon, CouponModel } from "../interface/coupon.interface";

@Injectable({
  providedIn: "root",
})
export class CouponService {

  constructor(private http: HttpClient) { }


  getCoupons(payload?: Params): Observable<CouponModel> {
    return this.http.get<CouponModel>(`${environment.configUrl}getCoupons`, { params: payload });
  }

  createCoupons(payload?: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${environment.configUrl}createCoupons`, payload);
  }

  updateCouponStatus(id: number, status: boolean): Observable<Coupon> {
    return this.http.post<Coupon>(`${environment.configUrl}updateCouponStatus/${id}`, { status });
  }

  EditCoupon(id?: number): Observable<Coupon> {
    return this.http.get<Coupon>(`${environment.configUrl}editCoupon/${id}`);
  }

  UpdateCoupons(id?: number, payload?: Coupon): Observable<Coupon> {
    console.log("UpdateCoupons", id, payload);

    return this.http.post<Coupon>(`${environment.configUrl}updateCoupons/${id}`, payload);
  }

  DeleteCoupons(id?: number): Observable<Coupon> {
    return this.http.delete<Coupon>(`${environment.configUrl}deletecoupons/${id}`,);
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.configUrl}deleteAllCoupons`, { ids });
  }

}
