import { Component, Input } from '@angular/core';
import { Product } from '../../../../../shared/interface/product.interface';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import * as data from  '../../../../../shared/data/owl-carousel';

@Component({
  selector: 'app-product-accordion',
  templateUrl: './product-accordion.component.html',
  styleUrls: ['./product-accordion.component.scss']
})
export class ProductAccordionComponent {

  @Input() product: Product;
  @Input() option: Option | null;

  public activeSlide: string = '0';

  public productMainThumbSlider = data.productMainThumbSlider;
  public productThumbSlider = data.productThumbSlider;

}
