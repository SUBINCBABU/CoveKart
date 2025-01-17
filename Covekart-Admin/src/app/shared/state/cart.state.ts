import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { of, tap } from "rxjs";
import { GetCartItems, AddToCart, UpdateCart, DeleteCart, ClearCart } from "../action/cart.action";
import { Cart, CartModel } from "../interface/cart.interface";
import { CartService } from "../services/cart.service";
import { NotificationService } from "../services/notification.service";

export interface CartStateModel {
  items: Cart[];
  total: number;
}
  
@State<CartStateModel>({
  name: "cart",
  defaults: {
    items: [],
    total: 0
  },
})
@Injectable()
export class CartState {
    
  constructor(private cartService: CartService,
    private notificationService: NotificationService,
    private store: Store) {}

  @Selector()
  static cartItems(state: CartStateModel) {
    return state.items;
  }

  @Selector()
  static cartTotal(state: CartStateModel) {
    return state.total;
  }

  @Action(GetCartItems)
  getCartItems(ctx: StateContext<CartStateModel>) {
    return this.cartService.getCartItems().pipe(
      tap({
        next: result => { 
          ctx.patchState(result);
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(AddToCart) 
  add(ctx: StateContext<CartStateModel>, action: AddToCart) {
    if(action.payload.id){
      this.store.dispatch(new UpdateCart(action.payload));
    } else {
      let salePrice = action.payload.variation ?  action.payload.variation.sale_price : action.payload.product?.sale_price;
      let result: CartModel = {
        items: [{
          id: Number(Math.floor(Math.random() * 10000).toString().padStart(4, '0')), // Generate Random Id
          quantity: action.payload.quantity,
          sub_total: salePrice ? salePrice * action.payload.quantity : 0,
          product: action.payload.product!,
          product_id: action.payload.product_id,
          variation: action.payload.variation!,
          variation_id: action.payload.variation_id
        }]
      }
  
      const state = ctx.getState();
      const cart = [...state.items];
      const index = cart.findIndex(item => item.id === result.items[0].id);
      
      let output = { ...state };
  
      if (index == -1) {
        output.items = [...state.items, ...result.items];
      }
  
      // Calculate Total
      output.total = output.items.reduce((prev, curr: Cart) => {
        return (prev + Number(curr.sub_total));
      }, 0);
  
      ctx.patchState(output);
    }
  }

  @Action(UpdateCart)
  update(ctx: StateContext<CartStateModel>, action: UpdateCart) {
    const state = ctx.getState();
    const cart = [...state.items];
    const index = cart.findIndex(item => item.id === action.payload.id);
    const productQty = cart[index]?.variation ? cart[index]?.variation?.quantity : cart[index]?.product?.quantity;

    if(productQty < cart[index]?.quantity + action?.payload.quantity) {
      this.notificationService.showError(`You can not add more items than available. In stock ${productQty} items.`);
      return false;
    }

    cart[index].quantity = cart[index]?.quantity + action?.payload.quantity;
    cart[index].sub_total = cart[index].quantity * (cart[index]?.variation ? cart[index]?.variation?.sale_price : cart[index].product.sale_price);

    if(cart[index].quantity < 1) {
      this.store.dispatch(new DeleteCart(action.payload.id!));
      return of();
    }

    let total = state.items.reduce((prev, curr: Cart) => {
      return (prev + Number(curr.sub_total));
    }, 0);
  
    ctx.patchState({
      ...state,
      total: total
    });

    return true;
  }

  @Action(DeleteCart)
  delete(ctx: StateContext<CartStateModel>, { id }: DeleteCart) {
    const state = ctx.getState();
    let cart  = state.items.filter(value => value.id !== id);
    let total = state.items.reduce((prev, curr: Cart) => {
      return (prev + Number(curr.sub_total));
    }, 0);
    ctx.patchState({
      items: cart,
      total: total
    });
    return true;
  }

  @Action(ClearCart)
  clearCart(ctx: StateContext<CartStateModel>) {
    ctx.patchState({
      items: [],
      total: 0
    });
  }

}
  