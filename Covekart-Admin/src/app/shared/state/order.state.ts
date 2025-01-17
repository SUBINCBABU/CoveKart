import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetOrders, SelectUser, ViewOrder, Checkout, PlaceOrder, UpdateOrderStatus, Clear } from "../action/order.action";
import { Order, OrderCheckout } from "../interface/order.interface";
import { User } from "../interface/user.interface";
import { UserService } from "../services/user.service";
import { OrderService } from "../services/order.service";

export class OrderStateModel {
  order = {
    data: [] as Order[],
    total: 0
  }
  selectedOrder: Order | null
  selectedUser: User | null
  checkout: OrderCheckout | null
}

@State<OrderStateModel>({
  name: "order",
  defaults: {
    order: {
      data: [],
      total: 0
    },
    selectedOrder: null,
    selectedUser: null,
    checkout: null
  },
})
@Injectable()
export class OrderState {
  
  constructor(private router: Router,
    private orderService: OrderService,
    private userService: UserService) {}

  @Selector()
  static order(state: OrderStateModel) {
    return state.order;
  }

  @Selector()
  static selectedUser(state: OrderStateModel) {
    return state.selectedUser;
  }

  @Selector()
  static selectedOrder(state: OrderStateModel) {
    return state.selectedOrder;
  }

  @Selector()
  static checkout(state: OrderStateModel) {
    return state.checkout;
  }

  @Action(GetOrders)
  getOrders(ctx: StateContext<OrderStateModel>, action: GetOrders) {
    return this.orderService.getOrders(action?.payload).pipe(
      tap({
        next: result => { 
         
          ctx.patchState({
            order: {
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

  
  // @Action(GetOrders)
  // getOrders(ctx: StateContext<OrderStateModel>, action: GetOrders) {
  //   return this.orderService.getOrders(action?.payload).pipe(
  //     tap({
  //       next: result => {
        
  //         ctx.patchState({
  //           order: {
  //             data: result.data,
  //             total: result?.total ? result?.total : result.data?.length
  //           }
  //         });
  //       },
  //       error: err => {
  //         throw new Error(err?.error?.message);
  //       }
  //     })
  //   );
  // }


  @Action(SelectUser)
  selectUser(ctx: StateContext<OrderStateModel>, { id }: SelectUser) {
    return this.userService.getUsers().pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          const user = result.data.find(user => user.id == id);
          ctx.patchState({
            ...state,
            selectedUser: user
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ViewOrder)
  viewOrder(ctx: StateContext<OrderStateModel>, { id }: ViewOrder) {
    return this.orderService.getOrders().pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          const order = result.data.find(order => order.order_number == id);
          ctx.patchState({
            ...state,
            selectedOrder: order
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(Checkout)
  checkout(ctx: StateContext<OrderStateModel>, action: Checkout) {

    const state = ctx.getState();

    // It Just Static Values as per cart default value (When you are using api then you need calculate as per your requirement)
    const order = {
      total : {
        convert_point_amount: -10,
        convert_wallet_balance: -84.4,
        coupon_total_discount: 10,
        points: 300,
        points_amount: 10,
        shipping_total: 0,
        sub_total: 35.19,
        tax_total: 2.54,
        total: 37.73,
        wallet_balance: 84.4,
      }
    }

    ctx.patchState({
      ...state,
      checkout: order
    });
  }

  @Action(PlaceOrder)
  placeOrder(ctx: StateContext<OrderStateModel>, action: PlaceOrder) {
    this.router.navigateByUrl(`/order/details/1000`);
  }

  @Action(UpdateOrderStatus)
  updateOrderStatus(ctx: StateContext<OrderStateModel>, { id, payload }: UpdateOrderStatus) {
    // Update Order Status Logic Here
  }

  @Action(Clear)
  clear(ctx: StateContext<OrderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      selectedUser: null,
      checkout: null
    });
  }

}  