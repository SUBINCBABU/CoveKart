import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

// State
import { ProductState } from '../../shared/state/product.state';
import { OrderState } from '../../shared/state/order.state';
import { ReviewState } from '../../shared/state/review.state';
import { BlogState } from '../../shared/state/blog.state';
import { CategoryState } from '../../shared/state/category.state';
import { StoreState } from '../../shared/state/store.state';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      ProductState,
      OrderState,
      ReviewState,
      BlogState,
      CategoryState,
      StoreState
    ]),
  ]
})
export class DashboardModule { }
