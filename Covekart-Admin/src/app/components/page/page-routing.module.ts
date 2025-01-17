import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: PageComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'page.index' 
    }
  },
  {
    path: "create",
    component: CreatePageComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['page.index', 'page.create']
    }
  },
  {
    path: "edit/:id",
    component: EditPageComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['page.index', 'page.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
