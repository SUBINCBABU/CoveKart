import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateFaqComponent } from './create-faq/create-faq.component';
import { EditFaqComponent } from './edit-faq/edit-faq.component';
import { FaqComponent } from './faq.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'faq.index' 
    }
  },
  {
    path: "create",
    component: CreateFaqComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['faq.index', 'faq.create']
    }
  },
  {
    path: "edit/:id",
    component: EditFaqComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['faq.index', 'faq.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
