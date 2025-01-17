import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { CompareState } from '../../../shared/state/compare.state';
import { DeleteCompare, GetCompare } from '../../../shared/action/compare.action';
import { Product } from '../../../shared/interface/product.interface';
import { CompareService } from '../../../shared/services/compare.service';

@Component({
  selector: 'app-compeer',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent {

  public breadcrumb: Breadcrumb = {
    title: "Compare",
    items: [{ label: 'Compare', active: true }]
  }

  public skeletonItems = Array.from({ length: 3 }, (_, index) => index);

  @Select(CompareState.compareItems) compareItems$: Observable<Product[]>;

  constructor(private store: Store, public compareService: CompareService) {
    this.store.dispatch(new GetCompare());
  }

  removeCompare(id: number){
    this.store.dispatch(new DeleteCompare(id));
  }
}
