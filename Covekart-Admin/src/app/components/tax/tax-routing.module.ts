import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaxComponent } from './tax.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { EditTaxComponent } from './edit-tax/edit-tax.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: TaxComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'tax.index' 
    }
  },
  {
    path: "create",
    component: CreateTaxComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['tax.index', 'tax.create']
    }
  },
  {
    path: "edit/:id",
    component: EditTaxComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['tax.index', 'tax.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
