import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { NgxsModule } from '@ngxs/store';

// Components
import { UserComponent } from './user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormUserComponent } from './form-user/form-user.component';

// State
import { UserState } from './../../shared/state/user.state';
import { RoleState } from './../../shared/state/role.state';

@NgModule({
  declarations: [
    UserComponent,
    CreateUserComponent,
    EditUserComponent,
    FormUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      UserState, 
      RoleState
    ])
  ]
})
export class UserModule { }
