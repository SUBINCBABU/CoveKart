import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { StoreRoutingModule } from './store-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { StoreComponent } from './store.component';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { CreateStoreComponent } from './create-store/create-store.component';
import { FormStoreComponent } from './form-store/form-store.component';

// State
import { StoreState } from '../../shared/state/store.state';

@NgModule({
  declarations: [
    StoreComponent,
    EditStoreComponent,
    CreateStoreComponent,
    FormStoreComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      StoreState
    ])
  ]
})
export class StoreModule { }
