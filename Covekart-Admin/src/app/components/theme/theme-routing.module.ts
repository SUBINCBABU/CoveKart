import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ThemeComponent } from './theme.component';
import { ParisComponent } from './paris/paris.component';
import { TokyoComponent } from './tokyo/tokyo.component';
import { OsakaComponent } from './osaka/osaka.component';
import { RomeComponent  } from './rome/rome.component';
import { MadridComponent } from './madrid/madrid.component';
import { BerlinComponent } from './berlin/berlin.component';
import { DenverComponent } from './denver/denver.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'paris',
    component: ParisComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'tokyo',
    component: TokyoComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'osaka',
    component: OsakaComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'rome',
    component: RomeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'madrid',
    component: MadridComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'berlin',
    component: BerlinComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  },
  {
    path: 'denver',
    component: DenverComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'theme.index' 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
