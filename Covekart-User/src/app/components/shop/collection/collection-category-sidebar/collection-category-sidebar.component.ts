import { Component, Input } from '@angular/core';
import { Params } from '../../../../shared/interface/core.interface';
import * as data from  '../../../../shared/data/owl-carousel';
import { AttributeService } from '../../../../shared/services/attribute.service';

@Component({
  selector: 'app-collection-category-sidebar',
  templateUrl: './collection-category-sidebar.component.html',
  styleUrls: ['./collection-category-sidebar.component.scss']
})
export class CollectionCategorySidebarComponent {

  @Input() filter: Params;

  public categorySlider = data.categorySlider;

  constructor(public attributeService: AttributeService) {}

}
