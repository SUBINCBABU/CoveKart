import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { ShippingRoutingModule } from './shipping-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { ShippingComponent } from './shipping.component';
import { FormShippingComponent } from './form-shipping/form-shipping.component';
import { ShippingCountryModalComponent } from './modal/shipping-country-modal/shipping-country-modal.component';
import { ShippingCountryComponent } from './shipping-country/shipping-country.component';
import { ShippingRuleModalComponent } from './modal/shipping-rule-modal/shipping-rule-modal.component';

// State
import { ShippingState } from '../../shared/state/shipping.state';

@NgModule({
  declarations: [
    ShippingComponent,
    FormShippingComponent,
    ShippingCountryModalComponent,
    ShippingCountryComponent,
    ShippingRuleModalComponent
  ],
  imports: [
    CommonModule,
    ShippingRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ShippingState])
  ]
})
export class ShippingModule { }
