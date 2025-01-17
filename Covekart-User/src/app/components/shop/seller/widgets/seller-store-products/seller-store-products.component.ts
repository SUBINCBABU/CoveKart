import { Component, Input } from '@angular/core';
import { Select  } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductState } from '../../../../../shared/state/product.state';
import { Product } from '../../../../../shared/interface/product.interface';
import { Stores } from '../../../../../shared/interface/store.interface';

@Component({
  selector: 'app-seller-store-products',
  templateUrl: './seller-store-products.component.html',
  styleUrls: ['./seller-store-products.component.scss']
})
export class SellerStoreProductsComponent {

  @Input() store: Stores;

  // @Select(ProductState.storeProducts) storeProducts$: Observable<Product[]>;

}
