import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from './store.component';
import { CreateStoreComponent } from './create-store/create-store.component';
import { EditStoreComponent } from './edit-store/edit-store.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: StoreComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'store.index' 
    }
  },
  {
    path: "create",
    component: CreateStoreComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['store.index', 'store.create']
    }
  },
  {
    path: "edit/:id",
    component: EditStoreComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['store.index', 'store.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
