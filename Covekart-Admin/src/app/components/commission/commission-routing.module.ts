import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommissionComponent } from './commission.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: CommissionComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'commission_history.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionRoutingModule { }
