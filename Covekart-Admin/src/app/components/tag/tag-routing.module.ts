import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TagComponent } from './tag.component';
import { CreateTagComponent } from './create-tag/create-tag.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: TagComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'tag.index' 
    }
  },
  {
    path: "create",
    component: CreateTagComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['tag.index', 'tag.create']
    }
  },
  {
    path: "edit/:id",
    component: EditTagComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['tag.index', 'tag.edit']
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
