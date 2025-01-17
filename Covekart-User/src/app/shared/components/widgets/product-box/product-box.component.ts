import { Component, Input } from '@angular/core';
import { Product } from '../../../../shared/interface/product.interface';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss']
})
export class ProductBoxComponent {
  
  @Input() product: Product;
  @Input() style: string  = 'horizontal';
  @Input() class: string;
  @Input() close: boolean = false;

}
