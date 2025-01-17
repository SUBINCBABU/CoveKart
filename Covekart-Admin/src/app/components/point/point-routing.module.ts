import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PointComponent } from './point.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: PointComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'point.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointRoutingModule { }
