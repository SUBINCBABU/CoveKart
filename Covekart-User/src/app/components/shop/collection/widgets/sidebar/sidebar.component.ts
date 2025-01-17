import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AttributeService } from '../../../../../shared/services/attribute.service';
import { Params } from '../../../../../shared/interface/core.interface';
import { AttributeModel } from '../../../../../shared/interface/attribute.interface';
import { AttributeState } from '../../../../../shared/state/attribute.state';
import { GetAttributes } from '../../../../../shared/action/attribute.action';

@Component({
  selector: 'app-collection-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class CollectionSidebarComponent {

  @Input() filter: Params;

  @Select(AttributeState.attribute) attribute$: Observable<AttributeModel>;

  constructor(private store: Store,
    public attributeService: AttributeService) {
    this.store.dispatch(new GetAttributes({ status: 1}));
  }

  closeCanvasMenu() {
    this.attributeService.offCanvasMenu = false;
  }

}
