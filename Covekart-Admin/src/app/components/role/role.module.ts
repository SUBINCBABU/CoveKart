import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from '@ngxs/store';
import { RolesRoutingModule } from "./role-routing.module";
import { SharedModule } from "../../shared/shared.module";

// Components
import { RoleComponent } from './role.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { FormRoleComponent } from './form-role/form-role.component';

// State
import { RoleState } from '../../shared/state/role.state';

@NgModule({
  declarations: [
    RoleComponent,
    CreateRoleComponent,
    PermissionsComponent,
    EditRoleComponent,
    FormRoleComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    NgxsModule.forFeature([RoleState])
  ],
})
export class RoleModule {}
