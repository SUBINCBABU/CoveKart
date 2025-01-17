import { Component, Input, SimpleChanges } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, Variation, SelectedVariant } from '../../../../../../shared/interface/product.interface';
import { Cart, CartAddOrUpdate } from '../../../../../../shared/interface/cart.interface';
import { AddToCart } from '../../../../../../shared/action/cart.action';
import { CartState } from '../../../../../../shared/state/cart.state';
import { Option } from '../../../../../../shared/interface/theme-option.interface';
import { AddToWishlist } from '../../../../../../shared/action/wishlist.action';
import { AddToCompare } from '../../../../../../shared/action/compare.action';

@Component({
  selector: 'app-product-contain',
  templateUrl: './product-contain.component.html',
  styleUrls: ['./product-contain.component.scss'],
})
export class ProductContainComponent {

  @Input() product: Product;
  @Input() option: Option | null;
  @Input() owlCar: any;

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;

  public cartItem: Cart | null;
  public productQty: number = 1;
  public selectedVariation: Variation | null;

  public ordersCount: number = 10;
  public viewsCount: number = 30;

  public countsInterval: any;

  constructor(private store: Store, private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {

    this.selectedVariation = null;
    
    if(changes['product'] && changes['product'].currentValue) {
      this.product = changes['product']?.currentValue;
    }

    this.countsInterval = setInterval(() => {
      let encourage_max_view_count = this.option?.product?.encourage_max_view_count ? this.option?.product?.encourage_max_view_count : 100;
        this.viewsCount = Math.floor(Math.random() * encourage_max_view_count) + 1;
    }, 5000);

    this.countsInterval = setInterval(() => {
      let encourage_max_order_count = this.option?.product?.encourage_max_order_count ? this.option?.product?.encourage_max_order_count : 100;
      this.ordersCount = Math.floor(Math.random() * encourage_max_order_count) + 1;
    }, 60000);

    this.cartItem$.subscribe(items => {
      this.cartItem = items.find(item => item.product.id == this.product.id)!;
    });
  }

  selectVariation(variation: Variation) {
    this.selectedVariation = variation;
  }

  updateQuantity(qty: number) {
    if(1 > this.productQty + (qty)) return;
    this.productQty = this.productQty + (qty);
    this.checkStockAvailable();
  }

  checkStockAvailable() {
    if(this.selectedVariation) {
      this.selectedVariation['stock_status'] = this.selectedVariation?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    } else {
      this.product['stock_status']  = this.product?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    }
  }

  addToCart(product: Product) {
    if(product) {
      const params: CartAddOrUpdate = {
        id: this.cartItem ? this.cartItem.id : null,
        product_id: product?.id,
        product: product ? product : null,
        variation: this.selectedVariation ? this.selectedVariation : null,
        variation_id: this.selectedVariation?.id ? this.selectedVariation?.id! : null,
        quantity: this.productQty
      }
      this.store.dispatch(new AddToCart(params));
    }
  }

  buyNow(product: Product) {
    if(product) {
      const params: CartAddOrUpdate = {
        id: this.cartItem ? this.cartItem.id : null,
        product_id: product?.id,
        product: product ? product : null,
        variation: this.selectedVariation ? this.selectedVariation : null,
        variation_id: this.selectedVariation?.id ? this.selectedVariation?.id! : null,
        quantity: this.productQty
      }
      this.store.dispatch(new AddToCart(params)).subscribe({
        complete: () => {
          this.router.navigate(['/checkout']);
        }
      });
    }
  }

  addToWishlist(id: number) {
    this.store.dispatch(new AddToWishlist({ product_id: id }));
  }

  addToCompare(id: number) {
    this.store.dispatch(new AddToCompare({ product_id: id }));
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.countsInterval) {
      clearInterval(this.countsInterval);
    }
  }

}
