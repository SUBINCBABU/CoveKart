import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WithdrawalComponent } from './withdrawal.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: WithdrawalComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'withdraw_request.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithdrawRequestRoutingModule { }
