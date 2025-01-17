import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Product } from '../../../../../../shared/interface/product.interface';
import { ProductState } from '../../../../../../shared/state/product.state';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent {

  @Select(ProductState.relatedProducts) relatedProduct$: Observable<Product[]>;

  @Input() product: Product | null;

  public relatedproducts: Product[] = [];

  ngOnChanges() {
    if (this.product?.related_products && Array.isArray(this.product?.related_products)) {
      this.relatedProduct$.subscribe(products => {
        this.relatedproducts = products.filter(product => this.product?.related_products?.includes(product?.id));
      });
    }
  }

}
