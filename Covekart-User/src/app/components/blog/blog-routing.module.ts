import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogResolver } from '../../shared/resolvers/blog.resolver';

import { BlogComponent } from './blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ScrollPositionGuard } from '../../shared/guard/scroll.guard';

const routes: Routes = [
  {
    path: 'blogs',
    component: BlogComponent,
    canActivate: [ScrollPositionGuard],
  },
  {
    path: 'blog/:slug',
    component: BlogDetailsComponent,
    resolve: {
      data: BlogResolver
    },
    canActivate: [ScrollPositionGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
