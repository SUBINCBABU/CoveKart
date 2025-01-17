import { Component, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Shipping, ShippingModel } from '../../shared/interface/shipping.interface';
import { ShippingState } from '../../shared/state/shipping.state';
import { GetShippings, DeleteShipping } from '../../shared/action/shipping.action';
import { ShippingCountryModalComponent } from "./modal/shipping-country-modal/shipping-country-modal.component";
import { DeleteModalComponent } from "../../shared/components/ui/modal/delete-modal/delete-modal.component";

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent {

  @Select(ShippingState.shipping) shipping$: Observable<ShippingModel>;

  @ViewChild("countryShippingModal") CountryShippingModal: ShippingCountryModalComponent;
  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  constructor(private store: Store) {
    this.store.dispatch(new GetShippings());
  }

  delete(actionType: string, data: Shipping) {
    this.store.dispatch(new DeleteShipping(data?.id));
  }

}
