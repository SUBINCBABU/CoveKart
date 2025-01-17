import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CouponComponent } from './coupon.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: CouponComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'coupon.index' 
    }
  },
  {
    path: "create",
    component: CreateCouponComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['coupon.index', 'coupon.create']
    }
  },
  {
    path: "edit/:id",
    component: EditCouponComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['coupon.index', 'coupon.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
