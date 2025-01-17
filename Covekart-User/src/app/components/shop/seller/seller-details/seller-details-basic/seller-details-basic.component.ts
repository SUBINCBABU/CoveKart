import { Component, Input } from '@angular/core';
import { Params } from '../../../../../shared/interface/core.interface';
import { Stores } from '../../../../../shared/interface/store.interface';

@Component({
  selector: 'app-seller-details-basic',
  templateUrl: './seller-details-basic.component.html',
  styleUrls: ['./seller-details-basic.component.scss']
})
export class SellerDetailsBasicComponent {

  @Input() filter: Params;
  @Input() store: Stores;

}
