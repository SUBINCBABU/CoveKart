import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DetailsComponent } from './details/details.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'order.index' 
    }
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'order.index'
    }
  },
  {
    path: 'create',
    component: CreateOrderComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['order.index', 'order.create']
    }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['order.index', 'order.create']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
