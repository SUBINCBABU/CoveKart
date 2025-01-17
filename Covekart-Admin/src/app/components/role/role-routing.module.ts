import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RoleComponent } from './role.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: RoleComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'role.index' 
    }
  },
  {
    path: "create",
    component: CreateRoleComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['role.index', 'role.create']
    }
  },
  {
    path: "edit/:id",
    component: EditRoleComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['role.index', 'role.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
