import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { OrderStatusRoutingModule } from './order-status-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { OrderStatusComponent } from './order-status.component';

// State
import { OrderStatusState } from '../../shared/state/order-status.state';

@NgModule({
  declarations: [
    OrderStatusComponent
  ],
  imports: [
    CommonModule,
    OrderStatusRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      OrderStatusState
    ])
  ]
})
export class OrderStatusModule { }
