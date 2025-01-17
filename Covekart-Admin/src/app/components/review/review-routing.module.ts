import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReviewComponent } from './review.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: ReviewComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'review.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
