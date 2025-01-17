import { Routes } from '@angular/router';

export const full: Routes = [ 
  {
    path: 'error',
    loadChildren: () => import('../../errors/errors.module').then(m => m.ErrorsModule),
  }
];


