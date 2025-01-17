import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RefundComponent } from './refund.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: RefundComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'refund.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule { }
