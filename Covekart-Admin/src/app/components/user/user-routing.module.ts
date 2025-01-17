import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'user.index' 
    }
  },
  {
    path: "create",
    component: CreateUserComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['user.index', 'user.create']
    }
  },
  {
    path: "edit/:id",
    component: EditUserComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['user.index', 'user.edit'] 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
