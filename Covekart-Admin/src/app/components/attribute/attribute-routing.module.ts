import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AttributeComponent } from './attribute.component';
import { CreateAttributeComponent } from './create-attribute/create-attribute.component';
import { EditAttributeComponent } from './edit-attribute/edit-attribute.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: AttributeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'attribute.index' 
    }
  },
  {
    path: "create",
    component: CreateAttributeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['attribute.index', 'attribute.create']
    }
  },
  {
    path: "edit/:id",
    component: EditAttributeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['attribute.index', 'attribute.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributeRoutingModule { }
