import { Component, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-collection-categories',
  templateUrl: './collection-categories.component.html',
  styleUrls: ['./collection-categories.component.scss']
})
export class CollectionCategoriesComponent {

  @Input() style: string = 'vertical';
  @Input() image: string;
  @Input() theme: string;
  @Input() title: string;
  @Input() sliderOption: OwlOptions;

  constructor(){}

}
