import { Component, Input, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Product } from '../../../interface/product.interface';
import { Cart, CartAddOrUpdate } from '../../../interface/cart.interface';
import { AddToCart } from '../../../action/cart.action';
import { AddtocartComponent } from './modal/addtocart/addtocart.component';
import { CartState } from 'src/app/shared/state/cart.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss']
})
export class ProductBoxComponent {

  @Input() product: Product;

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;
  @ViewChild("addToCartModal") addToCartModal: AddtocartComponent;

  public cartItem: Cart | null;

  constructor(private store: Store) {}

  ngOnInit() {
   
    this.cartItem$.subscribe(items => {
      this.cartItem = items.find(item => item.product.id == this.product.id)!;
    });
  }
  
  addToCart(product: Product, qty: number) {
    const params: CartAddOrUpdate = {
      id: this.cartItem ? this.cartItem.id : null,
      product_id: product?.id!,
      product: product,
      variation: null,
      variation_id: null,
      quantity: qty
    }
    this.store.dispatch(new AddToCart(params));
  }

}
