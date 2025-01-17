import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingCountryComponent } from './shipping-country/shipping-country.component';

import { ShippingComponent } from './shipping.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: ShippingComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'shipping.index' 
    }
  },
  {
    path: "edit/:id",
    component: ShippingCountryComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['shipping.index', 'shipping.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRoutingModule { }
