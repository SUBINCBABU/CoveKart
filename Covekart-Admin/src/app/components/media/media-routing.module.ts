import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MediaComponent } from './media.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: MediaComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'attachment.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
