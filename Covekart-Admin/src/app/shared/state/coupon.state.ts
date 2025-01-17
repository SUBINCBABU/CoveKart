import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetCoupons, CreateCoupon, EditCoupon,
  UpdateCoupon, UpdateCouponStatus, DeleteCoupon,
  DeleteAllCoupon
} from "../action/coupon.action";
import { Coupon } from "../interface/coupon.interface";
import { CouponService } from "../services/coupon.service";
import { NotificationService } from "../services/notification.service";

export class CouponStateModel {
  coupon = {
    data: [] as Coupon[],
    total: 0
  }
  selectedCoupon: Coupon | null;
}

@State<CouponStateModel>({
  name: "coupon",
  defaults: {
    coupon: {
      data: [],
      total: 0
    },
    selectedCoupon: null
  },
})
@Injectable()
export class CouponState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private couponService: CouponService) { }

  @Selector()
  static coupon(state: CouponStateModel) {
    return state.coupon;
  }

  @Selector()
  static selectedCoupon(state: CouponStateModel) {
    return state.selectedCoupon;
  }

  @Action(GetCoupons)
  getCoupons(ctx: StateContext<CouponStateModel>, action: GetCoupons) {
    return this.couponService.getCoupons(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            coupon: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateCoupon)
  create(ctx: StateContext<CouponStateModel>, action: CreateCoupon) {
    const state = ctx.getState()

    return this.couponService.createCoupons(action.payload).pipe(
      tap({
        next: (result: Coupon) => {

          ctx.patchState({
            coupon: {
              data: [...state.coupon.data, result],
              total: state.coupon.total + 1,
            },
          });
          this.notificationService.showSuccess('coupon created successfully.')
        },
        error: (err) => {

          this.notificationService.showError('Failed to fetch coupon.');
          throw new Error(err?.error?.message);
        },
      })
    );

  }

  @Action(UpdateCoupon)
  update(ctx: StateContext<CouponStateModel>, { payload, id }: UpdateCoupon) {
    const state = ctx.getState();
    const updatedCoupons = state.coupon.data.map(coupon => {
      if (coupon.id === id) {
        return { ...coupon, ...payload };
      }
      return coupon;
    });

    ctx.patchState({
      coupon: {
        data: updatedCoupons,
        total: state.coupon.total,
      },
    });

    this.couponService.UpdateCoupons(id, payload).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('coupon updated successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to update coupon.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }

 @Action(EditCoupon)
  edit(ctx: StateContext<CouponStateModel>, { id }: EditCoupon) {
    return this.couponService.EditCoupon(id).pipe(
      tap({
        next: (result: Coupon) => { 
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedCoupon: result,

          });
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || 'Failed to fetch Coupon details for editing.'
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }


  @Action(UpdateCouponStatus)
  updateStatus(ctx: StateContext<CouponStateModel>, { id, status }: UpdateCouponStatus) {
    const state = ctx.getState();
    const updatedCoupons = state.coupon.data.map(coupon =>
      coupon.id === id ? { ...coupon, status } : coupon
    );

    ctx.patchState({
      coupon: {
        data: updatedCoupons,
        total: state.coupon.total,
      },
    });

    return this.couponService.updateCouponStatus(id, status).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('coupon updated successfully.');
        },
        error: (err) => {

          ctx.patchState({
            coupon: {
              data: state.coupon.data,
              total: state.coupon.total,
            },
          });
          this.notificationService.showError('Failed to update coupon.');
          console.error(err);
        },
      })
    );
  }


  @Action(DeleteCoupon)
  delete(ctx: StateContext<CouponStateModel>, { id }: DeleteCoupon) {
    const state = ctx.getState();
    const filteredCoupons = state.coupon.data.filter(coupon => coupon.id !== id);

    ctx.patchState({
      coupon: {
        data: filteredCoupons,
        total: state.coupon.total - 1,
      },
    });

    this.couponService.DeleteCoupons(id).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('coupon deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to delete coupon.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }


  @Action(DeleteAllCoupon)
  deleteAll(ctx: StateContext<CouponStateModel>, { ids }: DeleteAllCoupon) {

    const state = ctx.getState();

    return this.couponService.deleteAll(ids).pipe(
      tap({
        next: () => {
          const remainingCoupons = state.coupon.data.filter(coupon => !ids.includes(coupon.id));

          ctx.patchState({
            coupon: {
              ...state.coupon,
              data: remainingCoupons,
              total: state.coupon.total - ids.length,
            },
          });

          this.notificationService.showSuccess('coupon deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete coupon.');
          throw new Error(err?.error?.message || 'Failed to delete coupon.');
        },
      })
    );

  }

}