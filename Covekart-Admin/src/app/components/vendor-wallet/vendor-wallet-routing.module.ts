import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VendorWalletComponent } from './vendor-wallet.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: VendorWalletComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'vendor_wallet.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorWalletRoutingModule { }
